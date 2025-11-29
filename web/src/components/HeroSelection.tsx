import React from 'react';
import { Hero } from '../types';
import './HeroSelection.css';

interface HeroSelectionProps {
  heroes: Hero[];
  onSelectHero: (heroId: string) => void;
  selectedHero?: string;
}

export function HeroSelection({ heroes, onSelectHero, selectedHero }: HeroSelectionProps) {
  const [showShop, setShowShop] = React.useState(false);

  return (
    <div className="hero-selection-screen">
      <div className="hero-selection-container">
        <div className="selection-header">
          <h2>Choose Your Hero</h2>
          <p>Select a hero to begin your journey through UnderCrypt</p>
          <button className="shop-btn" onClick={() => setShowShop(!showShop)}>
            🛒 {showShop ? 'Hide Shop' : 'Shop'}
          </button>
        </div>

        {showShop && (
          <div className="shop-panel">
            <h3>Shop</h3>
            <p className="shop-notice">Coming Soon! You'll be able to purchase card packs, relics, and upgrades here.</p>
          </div>
        )}

        <div className="heroes-grid">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className={`hero-card ${selectedHero === hero.id ? 'selected' : ''}`}
              onClick={() => onSelectHero(hero.id)}
            >
              <div className="hero-card-header">
                <h3>{hero.name}</h3>
                <span className="hero-class">{hero.class}</span>
              </div>

              <div className="hero-card-stats">
                <div className="stat">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{hero.baseHP}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Hand Size</span>
                  <span className="stat-value">{hero.handSize}</span>
                </div>
              </div>

              <div className="hero-card-abilities">
                <div className="ability">
                  <span className="ability-label">Passive</span>
                  <span className="ability-name">{hero.passive}</span>
                </div>
                <div className="ability">
                  <span className="ability-label">Active</span>
                  <span className="ability-name">{hero.active}</span>
                </div>
              </div>

              <div className="hero-card-description">
                {hero.class === 'Warrior' && (
                  <p>High HP and defense. Excels at absorbing damage and dealing consistent strikes.</p>
                )}
                {hero.class === 'Mage' && (
                  <p>Medium HP, powerful elemental attacks. Control the battlefield with fire and magic.</p>
                )}
                {hero.class === 'Rogue' && (
                  <p>Low HP but high damage. Move fast and strike quickly with poison and precision.</p>
                )}
              </div>

              <button
                className="select-hero-btn"
                onClick={() => onSelectHero(hero.id)}
              >
                {selectedHero === hero.id ? '✓ Selected' : 'Select Hero'}
              </button>
            </div>
          ))}
        </div>

        {selectedHero && (
          <div className="selection-footer">
            <button className="start-adventure-btn" onClick={() => {}}>
              Begin Your Adventure →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
