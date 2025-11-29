import React from 'react';
import { Card } from '../types';
import './RewardPanel.css';

interface Props {
  options: Card[];
  onChoose: (card: Card) => void;
  onSkip: () => void;
}

export function RewardPanel({ options, onChoose, onSkip }: Props) {
  const getEffectSummary = (effects: any[]) => {
    return effects.map((e: any) => {
      if (e.type === 'damage') {
        const target = e.target === 'all_enemies' ? ' (All)' : e.target === 'self' ? ' (Self)' : '';
        return `${e.value} DMG${target}`;
      }
      if (e.type === 'block') return `${e.value} Block`;
      if (e.type === 'heal') return `${e.value} Heal`;
      if (e.type === 'draw') return `Draw ${e.value}`;
      if (e.type === 'poison') return `${e.value} Poison`;
      if (e.type === 'freeze') return `Freeze ${e.value}`;
      if (e.type === 'status') return `${e.name} ${e.value}`;
      if (e.type === 'energy') return `+${e.value} Energy`;
      return `${e.type} ${e.value}`;
    }).join(' • ');
  };

  return (
    <div className="reward-overlay" role="dialog" aria-modal="true">
      <div className="reward-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Choose Your Reward</h2>
        <p>Select one card to add to your deck, or skip.</p>
        <div className="reward-options">
          {options.map((c) => (
            <button key={c.id} className={`reward-card ${c.type.toLowerCase()}`} onClick={() => onChoose(c)}>
              <div className="reward-name">{c.name}</div>
              <div className="reward-effects">{getEffectSummary(c.effects)}</div>
              <div className="reward-meta">
                <span className="cost">Energy: {c.cost}</span>
                <span className="type">{c.type}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="reward-actions">
          <button className="skip-btn" onClick={onSkip}>Skip</button>
        </div>
      </div>
    </div>
  );
}
