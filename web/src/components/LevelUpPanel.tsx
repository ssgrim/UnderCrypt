import React from 'react';
import './LevelUpPanel.css';

interface LevelUpPanelProps {
  level: number;
  xp: number;
  maxXp: number;
  baseHP: number;
  maxEnergy: number;
  onClose: () => void;
}

export function LevelUpPanel({ level, xp, maxXp, baseHP, maxEnergy, onClose }: LevelUpPanelProps) {
  const xpPercent = (xp / maxXp) * 100;

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-panel" onClick={(e) => e.stopPropagation()}>
        <div className="level-up-header">
          <h2>⭐ LEVEL UP! ⭐</h2>
          <div className="level-display">
            <span className="level-number">{level}</span>
          </div>
        </div>

        <div className="level-up-stats">
          <div className="stat-row">
            <span className="stat-label">Health:</span>
            <span className="stat-value">+{Math.floor(baseHP * 0.1)} HP</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Energy:</span>
            <span className="stat-value">+1 Max Energy (Now {maxEnergy})</span>
          </div>
        </div>

        <div className="xp-bar-container">
          <div className="xp-label">Experience</div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${Math.min(xpPercent, 100)}%` }} />
          </div>
          <div className="xp-text">{xp} / {maxXp} XP</div>
        </div>

        <button className="close-level-up-btn" onClick={onClose}>
          Continue →
        </button>
      </div>
    </div>
  );
}
