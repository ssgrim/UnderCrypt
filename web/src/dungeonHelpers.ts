import { DungeonRoom, Monster, RoomType } from './types';
import { scaleEnemyStats, shuffle } from './gameEngine';

export function generateDungeonRooms(
  monsterPool: Monster[],
  heroLevel: number,
  count: number = 6
): DungeonRoom[] {
  const shuffledPool = shuffle([...monsterPool]);
  const rooms: DungeonRoom[] = [];

  for (let i = 0; i < count; i++) {
    const roomType: RoomType = i === count - 1 ? 'boss' : i % 3 === 1 ? 'shop' : i % 3 === 2 ? 'event' : 'battle';
    const baseMonster = shuffledPool[i % shuffledPool.length];
    const scaledLevel = heroLevel + Math.floor(i / 2);
    const scaledMonster = roomType === 'battle' || roomType === 'boss' 
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
