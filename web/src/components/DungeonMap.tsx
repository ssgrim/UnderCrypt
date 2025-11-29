import React from 'react';
import { DungeonRoom } from '../types';
import './DungeonMap.css';

interface Props {
  rooms: DungeonRoom[];
  currentRoomIndex: number | null;
  onSelectRoom: (index: number) => void;
}

export function DungeonMap({ rooms, currentRoomIndex, onSelectRoom }: Props) {
  return (
    <div className="dungeon-map-overlay">
      <div className="dungeon-map">
        <h2>Choose Your Path</h2>
        <p className="map-hint">Select a room to peek inside and begin your battle</p>
        <div className="rooms-grid">
          {rooms.map((room, idx) => {
            const canSelect = currentRoomIndex === null && !room.completed;
            const isCurrent = idx === currentRoomIndex;
            return (
              <button
                key={room.id}
                className={`room-card ${room.type} ${room.completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                onClick={() => canSelect && onSelectRoom(idx)}
                disabled={!canSelect}
              >
                <div className="room-header">
                  <span className="room-icon">{getRoomIcon(room.type)}</span>
                  <span className="room-type">{room.type}</span>
                </div>
                {room.monster && (
                  <div className="room-preview">
                    <div className="monster-name">{room.monster.name}</div>
                    <div className="monster-stats">
                      <span>Lv {room.monster.level || 1}</span>
                      <span>❤️ {room.monster.hp}</span>
                      <span>⚔️ {room.monster.attack}</span>
                    </div>
                    <div className="monster-type-badge">{room.monster.type}</div>
                  </div>
                )}
                {room.completed && <div className="completed-badge">✓ Cleared</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getRoomIcon(type: string): string {
  switch (type) {
    case 'battle': return '⚔️';
    case 'boss': return '👹';
    case 'shop': return '🛒';
    case 'event': return '❓';
    case 'reward': return '🎁';
    default: return '🚪';
  }
}
