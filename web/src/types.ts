export type Effect =
  | { type: 'damage'; value: number; target: 'enemy' | 'all_enemies' }
  | { type: 'block'; value: number; target: 'self' }
  | { type: 'heal'; value: number; target: 'self' }
  | { type: 'status'; name: string; value: number; target: 'enemy' | 'self' }
  | { type: 'draw'; value: number; target: 'self' };

export interface Card {
  id: string;
  name: string;
  type: 'Attack' | 'Defense' | 'Spell' | 'Summon' | 'Relic';
  cost: number;
  effects: Effect[];
  rarity?: string;
  tags?: string[];
}

export interface Hero {
  id: string;
  name: string;
  class: string;
  baseHP: number;
  handSize: number;
  startingDeck: string[];
  passive?: string;
  active?: string;
}

export interface Monster {
  id: string;
  name: string;
  type: 'Minion' | 'Elite' | 'Boss';
  hp: number;
  attack: number;
  level?: number;
  baseHP?: number;
  status?: Record<string, number>;
}

export interface GameState {
  hero: Hero & { hp: number; block: number; level: number; xp: number; maxXp: number };
  deck: Card[];
  hand: Card[];
  discard: Card[];
  enemies: Monster[];
  energy: number;
  maxEnergy: number;
  enemiesDefeated: number;
  // hero may have statuses at runtime
  // hero.status can be accessed as (state.hero as any).status
}
