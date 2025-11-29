import { Card, Hero, Monster } from './types';

export const cards: Card[] = [
  // BASIC ATTACKS
  {
    id: 'knight_strike',
    name: 'Knight\'s Strike',
    type: 'Attack',
    cost: 1,
    effects: [{ type: 'damage', value: 6, target: 'enemy' }],
  },
  {
    id: 'quick_slash',
    name: 'Quick Slash',
    type: 'Attack',
    cost: 1,
    effects: [{ type: 'damage', value: 4, target: 'enemy' }],
  },
  {
    id: 'heavy_strike',
    name: 'Heavy Strike',
    type: 'Attack',
    cost: 2,
    effects: [{ type: 'damage', value: 12, target: 'enemy' }],
  },

  // DEFENSIVE CARDS
  {
    id: 'defend',
    name: 'Defend',
    type: 'Defense',
    cost: 1,
    effects: [{ type: 'block', value: 5, target: 'self' }],
  },
  {
    id: 'shield_wall',
    name: 'Shield Wall',
    type: 'Defense',
    cost: 2,
    effects: [{ type: 'block', value: 12, target: 'self' }],
  },
  {
    id: 'brace_for_impact',
    name: 'Brace for Impact',
    type: 'Defense',
    cost: 1,
    effects: [{ type: 'block', value: 8, target: 'self' }],
  },

  // SPELL CARDS WITH SPECIAL EFFECTS
  {
    id: 'flame_burst',
    name: 'Flame Burst',
    type: 'Spell',
    cost: 2,
    effects: [{ type: 'damage', value: 8, target: 'all_enemies' }, { type: 'status', name: 'burn', value: 1, target: 'enemy' }],
  },
  {
    id: 'frost_bolt',
    name: 'Frost Bolt',
    type: 'Spell',
    cost: 2,
    effects: [{ type: 'damage', value: 6, target: 'enemy' }, { type: 'status', name: 'chill', value: 2, target: 'enemy' }],
  },
  {
    id: 'arcane_bolt',
    name: 'Arcane Bolt',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'damage', value: 5, target: 'enemy' }],
  },

  // POISON & STATUS EFFECTS
  {
    id: 'poison_dagger',
    name: 'Poison Dagger',
    type: 'Attack',
    cost: 1,
    effects: [{ type: 'damage', value: 3, target: 'enemy' }, { type: 'status', name: 'poison', value: 2, target: 'enemy' }],
  },
  {
    id: 'venomous_strike',
    name: 'Venomous Strike',
    type: 'Attack',
    cost: 2,
    effects: [{ type: 'damage', value: 5, target: 'enemy' }, { type: 'status', name: 'poison', value: 3, target: 'enemy' }],
  },

  // HEALING & UTILITY
  {
    id: 'heal_potion',
    name: 'Heal Potion',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'heal', value: 10, target: 'self' }],
  },
  {
    id: 'greater_healing',
    name: 'Greater Healing',
    type: 'Spell',
    cost: 3,
    effects: [{ type: 'heal', value: 20, target: 'self' }],
  },
  {
    id: 'inspiring_shout',
    name: 'Inspiring Shout',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'heal', value: 5, target: 'self' }, { type: 'damage', value: 4, target: 'all_enemies' }],
  },

  // COMBO & DRAW CARDS
  {
    id: 'second_wind',
    name: 'Second Wind',
    type: 'Spell',
    cost: 0,
    effects: [{ type: 'draw', value: 1, target: 'self' }],
  },
  {
    id: 'momentum',
    name: 'Momentum',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'heal', value: 3, target: 'self' }, { type: 'draw', value: 2, target: 'self' }],
  },

  // NEW CARDS FROM ARCHIVED DATA
  {
    id: 'shield_bash',
    name: 'Shield Bash',
    type: 'Attack',
    cost: 1,
    effects: [
      { type: 'damage', value: 3, target: 'enemy' },
      { type: 'block', value: 3, target: 'self' },
    ],
    rarity: 'Common',
    element: 'Neutral',
    tags: ['weapon'],
  },
  {
    id: 'power_strike',
    name: 'Power Strike',
    type: 'Attack',
    cost: 2,
    effects: [{ type: 'damage', value: 12, target: 'enemy' }],
    rarity: 'Common',
    element: 'Neutral',
    tags: ['weapon', 'heavy'],
  },
  {
    id: 'healing_potion',
    name: 'Healing Potion',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'heal', value: 8, target: 'self' }],
    rarity: 'Common',
    element: 'Divine',
    tags: ['consumable'],
  },
  {
    id: 'poison_dart',
    name: 'Poison Dart',
    type: 'Attack',
    cost: 1,
    effects: [
      { type: 'damage', value: 3, target: 'enemy' },
      { type: 'poison', value: 5, target: 'enemy', duration: 3 },
    ],
    rarity: 'Common',
    element: 'Shadow',
    tags: ['poison', 'ranged'],
  },
  {
    id: 'frost_bolt_enhanced',
    name: 'Enhanced Frost Bolt',
    type: 'Spell',
    cost: 1,
    effects: [
      { type: 'damage', value: 5, target: 'enemy' },
      { type: 'freeze', value: 1, target: 'enemy', duration: 2 },
    ],
    rarity: 'Common',
    element: 'Ice',
    tags: ['spell', 'control'],
  },
  {
    id: 'battle_focus',
    name: 'Battle Focus',
    type: 'Spell',
    cost: 1,
    effects: [{ type: 'draw', value: 2, target: 'self' }],
    rarity: 'Common',
    element: 'Neutral',
    tags: ['utility'],
  },
  {
    id: 'berserker_rage',
    name: 'Berserker Rage',
    type: 'Spell',
    cost: 2,
    effects: [
      { type: 'damage', value: 4, target: 'enemy' },
      { type: 'damage', value: 2, target: 'self' },
      { type: 'draw', value: 1, target: 'self' },
    ],
    rarity: 'Uncommon',
    element: 'Fire',
    tags: ['risky', 'aggressive'],
  },
  {
    id: 'flame_burst_aoe',
    name: 'Greater Flame Burst',
    type: 'Spell',
    cost: 2,
    effects: [{ type: 'damage', value: 8, target: 'all_enemies' }],
    rarity: 'Uncommon',
    element: 'Fire',
    tags: ['spell', 'aoe'],
  },
  {
    id: 'energy_surge',
    name: 'Energy Surge',
    type: 'Spell',
    cost: 0,
    effects: [{ type: 'energy', value: 2, target: 'self' }],
    rarity: 'Common',
    element: 'Neutral',
    tags: ['utility'],
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
  {
    id: 'adept_of_embers',
    name: 'Adept of Embers',
    class: 'Mage',
    baseHP: 60,
    handSize: 5,
    startingDeck: ['flame_burst', 'quick_slash', 'defend', 'heal_potion', 'quick_slash'],
    passive: 'Pyromancer',
    active: 'Fireball',
  },
  {
    id: 'shadow_rogue',
    name: 'Shadow Rogue',
    class: 'Rogue',
    baseHP: 50,
    handSize: 6,
    startingDeck: ['quick_slash', 'quick_slash', 'defend', 'poison_dagger', 'quick_slash', 'shield_wall'],
    passive: 'Evasion',
    active: 'Shadow Strike',
  },
] as const;

export const monsters: Monster[] = [
  // MINIONS (Common encounters)
  { id: 'giant_rat', name: 'Giant Rat', type: 'Minion', hp: 25, attack: 8 },
  { id: 'skeleton_warrior', name: 'Skeleton Warrior', type: 'Minion', hp: 35, attack: 12 },
  { id: 'poison_spider', name: 'Poison Spider', type: 'Minion', hp: 20, attack: 6 },

  // ELITES (Harder encounters)
  { id: 'orc_brute', name: 'Orc Brute', type: 'Elite', hp: 45, attack: 14 },
  { id: 'shadow_wraith', name: 'Shadow Wraith', type: 'Elite', hp: 65, attack: 18 },

  // BOSSES (End of floor)
  { id: 'rat_king', name: 'Rat King', type: 'Boss', hp: 120, attack: 15 },
  { id: 'dungeon_overlord', name: 'Dungeon Overlord', type: 'Boss', hp: 200, attack: 25 },
] as const;
