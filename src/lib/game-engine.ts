import { Card, Hero, Monster, GameState } from '../types/index';

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

  // Build starting deck from ids
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
  };

  drawToHandSize(state);
  return state;
}

export function drawToHandSize(state: GameState) {
  while (state.hand.length < state.hero.handSize) {
    if (state.deck.length === 0) {
      // reshuffle discard
      if (state.discard.length === 0) break;
      state.deck = shuffle(state.discard.splice(0, state.discard.length));
    }
    const card = state.deck.shift();
    if (!card) break;
    state.hand.push(card);
  }
}

export function startTurn(state: GameState) {
  state.energy = 3;
  state.hero.block = 0;
  drawToHandSize(state);
}

export function playCard(state: GameState, handIndex: number, targetIndex = 0) {
  const card = state.hand[handIndex];
  if (!card) throw new Error('No card at hand index');
  if (card.cost > state.energy) throw new Error('Not enough energy');
  state.energy -= card.cost;

  // process simple effects
  for (const eff of card.effects) {
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

  // move card to discard
  state.discard.push(...state.hand.splice(handIndex, 1));
}

export function enemyTurn(state: GameState) {
  for (const m of state.enemies) {
    if (m.hp <= 0) continue;
    const dmg = Math.max(0, m.attack - state.hero.block);
    state.hero.hp -= dmg;
  }
}

export function processStatusEffects(state: GameState) {
  // placeholder for poison, freeze, etc.
}

export function applyEffects() {
  // placeholder for resolving delayed effects
}
