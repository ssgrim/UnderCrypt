import { DungeonRoom, Monster, RoomType } from './types';
import { scaleEnemyStats, shuffle } from './gameEngine';

export function generateDungeonRooms(
  monsterPool: Monster[],
  heroLevel: number,
  count: number = 6
): DungeonRoom[] {
  // Separate monsters by type for better distribution
  const minions = monsterPool.filter(m => m.type === 'Minion');
  const elites = monsterPool.filter(m => m.type === 'Elite');
  const bosses = monsterPool.filter(m => m.type === 'Boss');

  const rooms: DungeonRoom[] = [];

  for (let i = 0; i < count; i++) {
    let roomType: RoomType;
    let baseMonster: Monster | undefined;

    // Last room is always boss
    if (i === count - 1) {
      roomType = 'boss';
      baseMonster = shuffle([...bosses])[0];
    } 
    // Elite rooms every 3rd room (except last)
    else if ((i + 1) % 3 === 0) {
      roomType = 'battle';
      baseMonster = shuffle([...elites])[0] || shuffle([...minions])[0];
    }
    // Mix of battles and other room types
    else if (i % 4 === 1) {
      roomType = 'shop';
    } else if (i % 5 === 2) {
      roomType = 'event';
    } else {
      roomType = 'battle';
      baseMonster = shuffle([...minions])[0];
    }

    // Scale monster difficulty based on position
    const scaledLevel = heroLevel + Math.floor(i / 2);
    const scaledMonster = baseMonster 
      ? scaleEnemyStats(baseMonster, scaledLevel)
      : undefined;

    rooms.push({
      id: `room-${i}`,
      type: roomType,
      completed: false,
      monster: scaledMonster,
    });
  }

  return rooms;
}
