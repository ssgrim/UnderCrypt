import { Card, Hero, Monster, GameState } from './types';

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function loadGameData(cards: Card[], heroes: Hero[], monsters: Monster[]) {
  return { cards, heroes, monsters };
}

export function startGame(data: ReturnType<typeof loadGameData>, heroId: string) {
  const hero = data.heroes.find((h) => h.id === heroId);
  if (!hero) throw new Error('Hero not found: ' + heroId);

  const deck = hero.startingDeck.map((id) => {
    const card = data.cards.find((c) => c.id === id);
    if (!card) throw new Error('Card not found: ' + id);
    return { ...card } as Card;
  });

  const shuffled = shuffle(deck);

  const state: GameState = {
    hero: { ...hero, hp: hero.baseHP, block: 0 },
    deck: shuffled,
    hand: [],
    discard: [],
    enemies: [],
    energy: 3,
    maxEnergy: 3,
  };

  drawToHandSize(state);
  return state;
}

export function drawToHandSize(state: GameState) {
  while (state.hand.length < state.hero.handSize) {
    if (state.deck.length === 0) {
      state.deck = shuffle(state.discard.splice(0));
    }
    const card = state.deck.shift();
    if (!card) break;
    state.hand.push(card);
  }
}

export function startTurn(state: GameState) {
  state.energy = state.maxEnergy;
  state.hero.block = 0;
  drawToHandSize(state);
}

export function playCard(state: GameState, handIndex: number, targetIndex = 0) {
  const card = state.hand[handIndex];
  if (!card) throw new Error('No card at hand index');
  if (card.cost > state.energy) throw new Error('Not enough energy');
  state.energy -= card.cost;

  for (const eff of card.effects) {
    if ((eff as any).type === 'status') {
      const s = eff as any;
      if (s.target === 'enemy') {
        const m = state.enemies[targetIndex];
        if (m) {
          m.status = m.status || {};
          m.status[s.name] = (m.status[s.name] || 0) + s.value;
        }
      } else if (s.target === 'self') {
        (state.hero as any).status = (state.hero as any).status || {};
        (state.hero as any).status[s.name] = ((state.hero as any).status[s.name] || 0) + s.value;
      }
      continue;
    }
    if (eff.type === 'damage') {
      if (state.enemies[targetIndex]) {
        state.enemies[targetIndex].hp -= eff.value;
      }
      if (eff.target === 'all_enemies') {
        state.enemies.forEach((e) => (e.hp -= eff.value));
      }
    } else if (eff.type === 'block') {
      state.hero.block += eff.value;
    } else if (eff.type === 'heal') {
      state.hero.hp = Math.min(state.hero.baseHP, state.hero.hp + eff.value);
    }
  }

  state.discard.push(...state.hand.splice(handIndex, 1));
}

export function enemyTurn(state: GameState) {
  for (const m of state.enemies) {
    if (m.hp <= 0) continue;
    if (m.status && (m.status['frozen'] || 0) > 0) {
      m.status['frozen'] = Math.max(0, (m.status['frozen'] || 0) - 1);
      continue;
    }
    const dmg = Math.max(0, m.attack - state.hero.block);
    state.hero.hp -= dmg;
  }
}

export function processStatusEffects(state: GameState) {
  for (const m of state.enemies) {
    if (!m.status) continue;
    if (m.status['poison'] && m.status['poison'] > 0) {
      m.hp -= m.status['poison'];
      m.status['poison'] = Math.max(0, m.status['poison'] - 1);
    }
    for (const k of Object.keys(m.status)) {
      if ((m.status as any)[k] === 0) delete (m.status as any)[k];
    }
  }

  const hStatus = (state.hero as any).status;
  if (hStatus) {
    if (hStatus['poison'] && hStatus['poison'] > 0) {
      state.hero.hp -= hStatus['poison'];
      hStatus['poison'] = Math.max(0, hStatus['poison'] - 1);
    }
    for (const k of Object.keys(hStatus)) {
      if ((hStatus as any)[k] === 0) delete (hStatus as any)[k];
    }
  }
}
