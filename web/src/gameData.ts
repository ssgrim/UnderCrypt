import { Card, Hero, Monster } from './types';

export const cards: Card[] = [
    // Game data is cached and reused across renders
  {
    id: 'knight_strike',
    name: 'Knight\'s Strike',
    type: 'Attack',
    cost: 1,
    effects: [{ type: 'damage', value: 6, target: 'enemy' }],
  },
  {
    id: 'defend',
    name: 'Defend',
    type: 'Defense',
    cost: 1,
    effects: [{ type: 'block', value: 5, target: 'self' }],
  },
  {
    id: 'flame_burst',
    name: 'Flame Burst',
    type: 'Spell',
    cost: 2,
    effects: [{ type: 'damage', value: 8, target: 'all_enemies' }],
  },
  {
    id: 'heal_potion',
    name: 'Heal Potion',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'heal', value: 10, target: 'self' }],
  },
] as const;

export const heroes: Hero[] = [
  {
    id: 'knight_of_ashes',
    name: 'Knight of Ashes',
    class: 'Warrior',
    baseHP: 80,
    handSize: 5,
    startingDeck: ['knight_strike', 'defend', 'defend', 'knight_strike', 'defend'],
    passive: 'Tough',
    active: 'Bash',
  },
] as const;

export const monsters: Monster[] = [
  { id: 'giant_rat', name: 'Giant Rat', type: 'Minion', hp: 25, attack: 8 },
  { id: 'spider', name: 'Giant Spider', type: 'Minion', hp: 20, attack: 6 },
] as const;
