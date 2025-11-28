import React from 'react';
import { GameState } from '../types';
import './GameBoard.css';

interface Props {
  state: GameState;
  onPlayCard: (index: number, target: number) => void;
  onEndTurn: () => void;
}

export function GameBoard({ state, onPlayCard, onEndTurn }: Props) {
  const [targetIdx, setTargetIdx] = React.useState(0);

  const memoizedHeroPanel = React.useMemo(() => <HeroPanel state={state} />, [state.hero.hp, state.hero.block, state.energy]);
  const memoizedEnemyPanel = React.useMemo(() => <EnemyPanel state={state} onSelectTarget={setTargetIdx} />, [state.enemies]);
  const memoizedHandPanel = React.useMemo(() => <HandPanel state={state} onPlayCard={onPlayCard} />, [state.hand, state.energy]);

  return (
    <div className="game-board">
      <div className="top-section">
        {memoizedHeroPanel}
        {memoizedEnemyPanel}
      </div>
      <div className="bottom-section">
        {memoizedHandPanel}
        <button className="end-turn-btn" onClick={onEndTurn}>
          End Turn
        </button>
      </div>
    </div>
  );
}

const setTargetIdx = (idx: number) => {
  // Will be managed by parent App component
};

const HeroPanel = React.memo(function HeroPanel({ state }: { state: GameState }) {
  const ratio = state.hero.hp / state.hero.baseHP;
  const color = ratio > 0.5 ? '#4a9' : ratio > 0.2 ? '#fa4' : '#f44';

  return (
    <div className="hero-panel">
      <h2>{state.hero.name}</h2>
      <div className="stats">
        <div className="stat">
          <span>HP:</span>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${ratio * 100}%`, backgroundColor: color }} />
          </div>
          <span>{state.hero.hp}/{state.hero.baseHP}</span>
        </div>
        <div className="stat">
          <span>Block:</span> <strong>{state.hero.block}</strong>
        </div>
        <div className="stat">
          <span>Energy:</span> <strong>{state.energy}/{state.maxEnergy}</strong>
        </div>
      </div>
    </div>
  );
});

const EnemyPanel = React.memo(function EnemyPanel({ state, onSelectTarget }: { state: GameState; onSelectTarget: (idx: number) => void }) {
  return (
    <div className="enemy-panel">
      <h2>Enemies ({state.enemies.filter((e) => e.hp > 0).length})</h2>
      <div className="enemies">
        {state.enemies.map((e, i) => (
          <div key={i} className={`enemy ${e.hp <= 0 ? 'defeated' : ''}`} onClick={() => onSelectTarget(i)}>
            <div className="name">{e.name}</div>
            <div className="hp">HP: {e.hp}</div>
            <div className="attack">ATK: {e.attack}</div>
            {e.status && Object.keys(e.status).length > 0 && (
              <div className="statuses">
                {Object.entries(e.status).map(([k, v]) => (
                  <span key={k} className="status-pill">{k}: {v}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const HandPanel = React.memo(function HandPanel({
  state,
  onPlayCard,
}: {
  state: GameState;
  onPlayCard: (index: number, target: number) => void;
}) {
  return (
    <div className="hand-panel">
      <h3>Hand ({state.hand.length}/{state.hero.handSize})</h3>
      <div className="hand">
        {state.hand.map((card, i) => (
          <CardButton
            key={i}
            card={card}
            index={i}
            canPlay={card.cost <= state.energy}
            onPlay={() => onPlayCard(i, 0)}
          />
        ))}
      </div>
    </div>
  );
});

const CardButton = React.memo(function CardButton({
  card,
  index,
  canPlay,
  onPlay,
}: {
  card: any;
  index: number;
  canPlay: boolean;
  onPlay: () => void;
}) {
  return (
    <button className={`card-btn ${card.type.toLowerCase()} ${!canPlay ? 'disabled' : ''}`} onClick={onPlay} disabled={!canPlay}>
      <div className="card-name">{card.name}</div>
      <div className="card-cost">{card.cost}</div>
      <div className="card-effect">
        {card.effects.map((e: any, i: number) => (
          <div key={i} className="effect">
            {e.type}: {e.value}
          </div>
        ))}
      </div>
    </button>
  );
});
