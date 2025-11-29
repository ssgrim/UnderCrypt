import React from 'react';
import { Card } from '../types';
import './RewardPanel.css';

interface Props {
  options: Card[];
  onChoose: (card: Card) => void;
  onSkip: () => void;
}

export function RewardPanel({ options, onChoose, onSkip }: Props) {
  return (
    <div className="reward-overlay" role="dialog" aria-modal="true">
      <div className="reward-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Choose Your Reward</h2>
        <p>Select one card to add to your deck, or skip.</p>
        <div className="reward-options">
          {options.map((c) => (
            <button key={c.id} className={`reward-card ${c.type.toLowerCase()}`} onClick={() => onChoose(c)}>
              <div className="reward-name">{c.name}</div>
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
