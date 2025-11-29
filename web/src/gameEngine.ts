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

export function scaleEnemyStats(enemy: Monster, heroLevel: number): Monster {
  // More aggressive scaling: 8% HP and 5% attack per level
  const hpMultiplier = 1 + (heroLevel - 1) * 0.08;
  const attackMultiplier = 1 + (heroLevel - 1) * 0.05;

  // Type-based multiplier for additional scaling
  const typeMultipliers: Record<'Minion' | 'Elite' | 'Boss', number> = {
    'Minion': 1.0,
    'Elite': 1.4,
    'Boss': 1.8,
  };

  const hpTotal = hpMultiplier * typeMultipliers[enemy.type];
  const attackTotal = attackMultiplier * typeMultipliers[enemy.type];

  return {
    ...enemy,
    level: heroLevel,
    baseHP: enemy.hp,
    hp: Math.floor(enemy.hp * hpTotal),
    attack: Math.floor(enemy.attack * attackTotal),
  };
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
    hero: { ...hero, hp: hero.baseHP, block: 0, level: 1, xp: 0, maxXp: 100 },
    deck: shuffled,
    hand: [],
    discard: [],
    enemies: [],
    energy: 3,
    maxEnergy: 3,
    enemiesDefeated: 0,
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
    if (eff.type === 'poison' || eff.type === 'freeze') {
      const m = state.enemies[targetIndex];
      if (m) {
        m.status = m.status || {};
        m.status[eff.type] = (m.status[eff.type] || 0) + eff.value;
      }
      continue;
    }
    if (eff.type === 'damage') {
      if (eff.target === 'self') {
        // Self-damage (e.g., from risky cards)
        state.hero.hp -= eff.value;
      } else if (eff.target === 'all_enemies') {
        state.enemies.forEach((e) => (e.hp -= eff.value));
      } else if (state.enemies[targetIndex]) {
        state.enemies[targetIndex].hp -= eff.value;
      }
    } else if (eff.type === 'block') {
      state.hero.block += eff.value;
    } else if (eff.type === 'heal') {
      state.hero.hp = Math.min(state.hero.baseHP, state.hero.hp + eff.value);
    } else if ((eff as any).type === 'draw') {
      for (let i = 0; i < (eff as any).value; i++) {
        if (state.deck.length === 0) {
          state.deck = shuffle(state.discard.splice(0));
        }
        const drawnCard = state.deck.shift();
        if (drawnCard) state.hand.push(drawnCard);
      }
    }
  }

  state.discard.push(...state.hand.splice(handIndex, 1));
}

export function enemyTurn(state: GameState) {
  for (const m of state.enemies) {
    if (m.hp <= 0) continue;
    
    // Freeze prevents action
    if (m.status && (m.status['freeze'] || 0) > 0) {
      m.status['freeze'] = Math.max(0, (m.status['freeze'] || 0) - 1);
      continue;
    }

    // Calculate damage, reduced by chill
    let dmg = m.attack;
    if (m.status && (m.status['chill'] || 0) > 0) {
      dmg = Math.floor(dmg * 0.7); // Chill reduces damage by 30%
    }
    dmg = Math.max(0, dmg - state.hero.block);
    state.hero.hp -= dmg;
  }
}

export function processStatusEffects(state: GameState) {
  for (const m of state.enemies) {
    if (!m.status) continue;

    // Poison damage
    if (m.status['poison'] && m.status['poison'] > 0) {
      m.hp -= m.status['poison'];
      m.status['poison'] = Math.max(0, m.status['poison'] - 1);
    }

    // Burn damage (similar to poison)
    if (m.status['burn'] && m.status['burn'] > 0) {
      m.hp -= m.status['burn'] * 2;
      m.status['burn'] = Math.max(0, m.status['burn'] - 1);
    }

    // Chill reduces attack power (handled in enemyTurn)
    if (m.status['chill'] && m.status['chill'] > 0) {
      m.status['chill'] = Math.max(0, m.status['chill'] - 1);
    }

    // Clean up expired statuses
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
    if (hStatus['burn'] && hStatus['burn'] > 0) {
      state.hero.hp -= hStatus['burn'] * 2;
      hStatus['burn'] = Math.max(0, hStatus['burn'] - 1);
    }
    for (const k of Object.keys(hStatus)) {
      if ((hStatus as any)[k] === 0) delete (hStatus as any)[k];
    }
  }
}

export function gainXP(state: GameState, amount: number): boolean {
  state.hero.xp += amount;
  let leveledUp = false;

  while (state.hero.xp >= state.hero.maxXp && state.hero.level < 10) {
    state.hero.xp -= state.hero.maxXp;
    state.hero.level += 1;
    leveledUp = true;

    // Level up stat increases
    state.hero.baseHP = Math.floor(state.hero.baseHP * 1.1); // +10% HP
    state.hero.hp = Math.min(state.hero.hp + Math.floor(state.hero.baseHP * 0.1), state.hero.baseHP);
    state.maxEnergy = Math.min(state.maxEnergy + 1, 8); // Cap at 8

    // XP requirement increases per level
    state.hero.maxXp = Math.floor(100 * (1.2 ** state.hero.level));
  }

  return leveledUp;
}

export function awardEnemyXP(state: GameState, enemy: Monster) {
  // Award XP based on enemy type and level
  const baseXpRewards: Record<string, number> = {
    'Minion': 20,
    'Elite': 45,
    'Boss': 120,
  };

  const baseXp = baseXpRewards[enemy.type] || 20;
  // XP scales with enemy level (5% per level)
  const levelBonus = 1 + ((enemy.level || 1) - 1) * 0.05;
  const xp = Math.floor(baseXp * levelBonus);
  
  return gainXP(state, xp);
}
