import React from 'react';
import { GameState } from '../types';
import { getCardDescription, getCardEmoji } from '../cardHelpers';
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
  const xpRatio = state.hero.xp / state.hero.maxXp;

  return (
    <div className="hero-panel">
      <div className="hero-header">
        <h2>{state.hero.name}</h2>
        <div className="level-badge">Lvl {state.hero.level}</div>
      </div>
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
        {state.run && (
          <div className="stat gold-stat">
            <span>💰 Gold:</span> <strong>{state.run.gold}</strong>
          </div>
        )}
        <div className="stat">
          <span>XP:</span>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpRatio * 100}%` }} />
          </div>
          <span>{state.hero.xp}/{state.hero.maxXp}</span>
        </div>
      </div>
    </div>
  );
});

const EnemyPanel = React.memo(function EnemyPanel({ state, onSelectTarget }: { state: GameState; onSelectTarget: (idx: number) => void }) {
  const getStatusSummary = (e: any) => {
    const out: Array<{ label: string; value: string; cls?: string }> = [];
    const s = e.status || {};
    if (s.poison && s.poison > 0) out.push({ label: 'Poison', value: `-${s.poison} HP/turn`, cls: 'poison' });
    if (s.burn && s.burn > 0) out.push({ label: 'Burn', value: `-${s.burn * 2} HP/turn`, cls: 'burn' });
    if (s.freeze && s.freeze > 0) out.push({ label: 'Frozen', value: `Skips ${s.freeze} turn${s.freeze > 1 ? 's' : ''}`, cls: 'freeze' });
    if (s.chill && s.chill > 0) out.push({ label: 'Chill', value: `Attack -30%`, cls: 'chill' });
    for (const k of Object.keys(s)) {
      if (!['poison','burn','freeze','chill'].includes(k)) {
        out.push({ label: k, value: String(s[k]) });
      }
    }
    return out;
  };

  const getEmojiForMonster = (id: string) => {
    const low = id.toLowerCase();
    if (low.includes('spider')) return '🕷️';
    if (low.includes('rat')) return '🐀';
    if (low.includes('skeleton')) return '💀';
    if (low.includes('orc')) return '🗡️';
    if (low.includes('wraith')) return '👻';
    if (low.includes('overlord')) return '👹';
    if (low.includes('king')) return '👑';
    return '👾';
  };

  return (
    <div className="enemy-panel">
      <h2>Enemies ({state.enemies.filter((e) => e.hp > 0).length})</h2>
      <div className="enemies">
        {state.enemies.map((e, i) => {
          const baseHP = e.baseHP || e.hp;
          const hpRatio = Math.max(0, e.hp) / Math.max(1, baseHP);
          const hpColor = hpRatio > 0.5 ? '#4a9' : hpRatio > 0.2 ? '#fa4' : '#f44';
          const summaries = getStatusSummary(e);
          const emoji = getEmojiForMonster(e.id);
          return (
            <div key={i} className={`enemy ${e.hp <= 0 ? 'defeated' : ''}`} onClick={() => onSelectTarget(i)}>
              <div className="enemy-header">
                <div className="name">{e.name}</div>
                {e.level && <div className="enemy-level">Lvl {e.level}</div>}
              </div>
              <div className="enemy-type">{e.type}</div>

              <div className="monster-avatar"><div className="avatar-emoji">{emoji}</div></div>

              <div className="enemy-hp">
                <div className="hp-bar">
                  <div className="hp-fill" style={{ width: `${Math.min(100, Math.round(hpRatio * 100))}%`, background: hpColor }} />
                </div>
                <div className="hp-numbers">HP: {Math.max(0, e.hp)}/{baseHP}</div>
              </div>

              <div className="attack">ATK: {e.attack}</div>

              {summaries.length > 0 && (
                <div className="status-details">
                  {summaries.map((s) => (
                    <div key={s.label} className={`status-detail ${s.cls || ''}`}>
                      <span className="status-name">{s.label}</span>
                      <span className="status-desc">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="card-button-wrapper" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <button className={`card-btn ${card.type.toLowerCase()} ${!canPlay ? 'disabled' : ''}`} onClick={onPlay} disabled={!canPlay}>
        <div className="card-emoji">{getCardEmoji(card.id)}</div>
        <div className="card-name">{card.name}</div>
        <div className="card-cost">{card.cost}</div>
      </button>
      {showTooltip && (
        <div className="card-tooltip">
          <div className="tooltip-name">{card.name}</div>
          <div className="tooltip-description">{getCardDescription(card.id)}</div>
          <div className="tooltip-effects">
            {card.effects.map((e: any, i: number) => (
              <div key={i} className="tooltip-effect">
                <span className="effect-type">{e.type}</span>: {e.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
