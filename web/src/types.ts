export type Effect =
  | { type: 'damage'; value: number; target: 'enemy' | 'all_enemies' | 'self' }
  | { type: 'block'; value: number; target: 'self' }
  | { type: 'heal'; value: number; target: 'self' }
  | { type: 'status'; name: string; value: number; target: 'enemy' | 'self'; duration?: number }
  | { type: 'draw'; value: number; target: 'self' }
  | { type: 'poison'; value: number; target: 'enemy'; duration?: number }
  | { type: 'freeze'; value: number; target: 'enemy'; duration?: number }
  | { type: 'energy'; value: number; target: 'self' };

export interface Card {
  id: string;
  name: string;
  type: 'Attack' | 'Defense' | 'Spell' | 'Summon' | 'Relic';
  cost: number;
  effects: Effect[];
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  tags?: string[];
  element?: string;
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

export type RoomType = 'battle' | 'reward' | 'shop' | 'event' | 'boss';

export interface DungeonRoom {
  id: string;
  type: RoomType;
  completed: boolean;
  monster?: Monster; // Preview info for battle/boss rooms
}

export interface RunState {
  act: number;
  floor: number;
  gold: number;
  rooms: DungeonRoom[];
  currentRoomIndex: number | null;
  relics?: string[];
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
  roomIndex?: number;
  pendingReward?: Card[];
  run?: RunState;
  // hero may have statuses at runtime
  // hero.status can be accessed as (state.hero as any).status
}
