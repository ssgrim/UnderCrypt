import React from 'react';
import './MapPanel.css';
import { Monster } from '../types';

export type RoomType = 'battle' | 'shop' | 'event' | 'boss';
export interface RoomNode {
  id: string;
  type: RoomType;
  preview?: { monster: Monster };
}

interface Props {
  rooms: RoomNode[];
  currentIndex: number;
  onChoose: (index: number) => void;
}

export function MapPanel({ rooms, currentIndex, onChoose }: Props) {
  return (
    <div className="map-overlay" role="dialog" aria-modal="true">
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Choose Your Path</h2>
        <p>Select a room to enter. Preview shows enemy type and level.</p>
        <div className="map-grid">
          {rooms.map((r, idx) => (
            <button
              key={r.id}
              className={`map-cell ${r.type} ${idx === currentIndex ? 'current' : ''}`}
              onClick={() => onChoose(idx)}
            >
              <div className="cell-type">{r.type.toUpperCase()}</div>
              {r.preview && (
                <div className="cell-preview">
                  <div className="pv-name">{r.preview.monster.name}</div>
                  <div className="pv-meta">Lvl {r.preview.monster.level ?? 1} • {r.preview.monster.type}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
