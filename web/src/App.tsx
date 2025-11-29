import React, { useState } from "react";
import { useCallback } from "react";
import { GameState } from "./types";
import { loadGameData, startGame, startTurn, playCard, enemyTurn, shuffle, awardEnemyXP, scaleEnemyStats } from "./gameEngine";
import { cards, heroes, monsters } from "./gameData";
import { GameBoard } from "./components/GameBoard";
import { GameOptions } from "./components/GameOptions";
import { HeroSelection } from "./components/HeroSelection";
import { LevelUpPanel } from "./components/LevelUpPanel";
import { RewardPanel } from "./components/RewardPanel";
import "./App.css";
import { playCardPlay, playDamage, playBlock, playHeal, playVictory, playDefeat, startBackgroundMusic, stopBackgroundMusic, setMusicVolume } from "./audio";

type Difficulty = "easy" | "normal" | "hard";
type GameSpeed = "slow" | "normal" | "fast";
type UiScale = 0.9 | 1 | 1.1 | 1.25 | 1.5;

interface GameSettings {
  difficulty: Difficulty;
  musicVolume: number;
  gameSpeed: GameSpeed;
  soundEnabled: boolean;
  uiScale: UiScale;
}

export function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [targetIdx, setTargetIdx] = useState(0);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem("underCryptSettings");
    const base = saved ? JSON.parse(saved) : {
      difficulty: "normal",
      musicVolume: 70,
      gameSpeed: "normal",
      soundEnabled: true,
      uiScale: 1,
    };
    // Ensure uiScale exists if loading from older storage
    if (!('uiScale' in base)) base.uiScale = 1;
    // Apply initial uiScale to document
    document.documentElement.style.setProperty('--ui-scale', String(base.uiScale));
    return base;
  });

  const handleSelectHero = useCallback((heroId: string) => {
    setMessage("");
    try {
      const data = loadGameData(cards, heroes, monsters);
      const newState = startGame(data, heroId as any);

      // Apply difficulty multipliers
      const difficultyMultipliers: Record<Difficulty, { heroHp: number; enemyDamage: number }> = {
        easy: { heroHp: 1.2, enemyDamage: 0.8 },
        normal: { heroHp: 1, enemyDamage: 1 },
        hard: { heroHp: 0.8, enemyDamage: 1.2 },
      };

      const mult = difficultyMultipliers[settings.difficulty];
      newState.hero.hp = Math.floor(newState.hero.hp * mult.heroHp);
      newState.hero.baseHP = Math.floor(newState.hero.baseHP * mult.heroHp);

      // Select random enemy and scale to hero level
      const selectedEnemy = shuffle(monsters.slice(0, 2))[0];
      const scaledEnemy = scaleEnemyStats(selectedEnemy, newState.hero.level);
      scaledEnemy.attack = Math.floor(scaledEnemy.attack * mult.enemyDamage);
      newState.enemies = [scaledEnemy];

      // Only set selected hero after successful initialization
      setSelectedHeroId(heroId);
      setState(newState);
      setGameOver(false);
      setMessage("");
      startBackgroundMusic();
      setMusicVolume(settings.musicVolume);
      document.documentElement.style.setProperty('--ui-scale', String(settings.uiScale));
    } catch (e: any) {
      const err = e?.message || String(e);
      console.error('Failed to start game:', err);
      setMessage(err);
      setSelectedHeroId(null);
      setState(null);
    }
  }, [settings.difficulty, settings.musicVolume]);

  const handleStart = useCallback(() => {
    if (selectedHeroId) {
      handleSelectHero(selectedHeroId);
    }
  }, [selectedHeroId, handleSelectHero]);

  const handlePlayCard = useCallback((handIndex: number, target: number) => {
    if (!state) return;
    try {
      if (settings.soundEnabled) playCardPlay();
      playCard(state, handIndex, target);
      if (settings.soundEnabled) {
        state.hand[handIndex]?.effects.forEach((eff: any) => {
          if (eff.type === "damage") playDamage();
          else if (eff.type === "block") playBlock();
          else if (eff.type === "heal") playHeal();
          else if (eff.type === "status") playDamage();
        });
      }
      setState({ ...state });
      setMessage("");
    } catch (e: any) {
      setMessage(e.message);
    }
  }, [state, settings.soundEnabled]);

  const handleEndTurn = useCallback(() => {
    if (!state) return;

    const defeatedEnemies = state.enemies.filter((e) => e.hp <= 0);
    state.enemies = state.enemies.filter((e) => e.hp > 0);

    if (state.enemies.length === 0) {
      // Award XP for defeated enemies and check for level-up
      if (defeatedEnemies.length > 0 && !showLevelUp) {
        let leveledUp = false;
        for (const enemy of defeatedEnemies) {
          if (awardEnemyXP(state, enemy)) {
            leveledUp = true;
          }
        }

        if (leveledUp) {
          setShowLevelUp(true);
          setState({ ...state });
          if (settings.soundEnabled) playVictory();
          return;
        }
      }

      // Present reward options (3 random cards) if not leveling
      const pool = shuffle(cards).filter((c) => c.type !== 'Relic');
      state.pendingReward = pool.slice(0, 3);
      setState({ ...state });
      if (settings.soundEnabled) playVictory();
      return;
    }

    enemyTurn(state);
    setState({ ...state });

    if (state.hero.hp <= 0) {
      setGameOver(true);
      setMessage(`Defeat! Hero HP reached 0.`);
      if (settings.soundEnabled) playDefeat();
      stopBackgroundMusic();
      return;
    }

    startTurn(state);
    setState({ ...state });
  }, [state, settings.soundEnabled, showLevelUp]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>UnderCrypt</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {state && (
            <button className="start-btn" onClick={() => {
              setSelectedHeroId(null);
              setState(null);
              setGameOver(false);
              stopBackgroundMusic();
            }}>
              Back to Heroes
            </button>
          )}
          <button className="start-btn" onClick={() => setOptionsOpen(true)}>
            ⚙️ Options
          </button>
        </div>
      </header>

      {!selectedHeroId ? (
        <HeroSelection
          heroes={heroes}
          onSelectHero={(heroId) => {
            setSelectedHeroId(heroId);
            handleSelectHero(heroId);
          }}
          selectedHero={selectedHeroId || undefined}
        />
      ) : !state ? (
        <div className="start-screen">
          <h2>Game Starting...</h2>
        </div>
      ) : (
        <div className="game-container">
          <GameBoard state={state} onPlayCard={handlePlayCard} onEndTurn={handleEndTurn} />
          {message && <div className="message">{message}</div>}
          {state?.pendingReward && (
            <RewardPanel
              options={state.pendingReward}
              onChoose={(card) => {
                if (!state) return;
                state.deck.push({ ...card });
                state.pendingReward = undefined;
                // Next room: spawn a new scaled enemy
                const mults: Record<Difficulty, { heroHp: number; enemyDamage: number }> = {
                  easy: { heroHp: 1.2, enemyDamage: 0.8 },
                  normal: { heroHp: 1, enemyDamage: 1 },
                  hard: { heroHp: 0.8, enemyDamage: 1.2 },
                };
                const mult = mults[settings.difficulty];
                const nextEnemyBase = shuffle(monsters.slice(0, 2))[0];
                const nextEnemy = scaleEnemyStats(nextEnemyBase, state.hero.level);
                nextEnemy.attack = Math.floor(nextEnemy.attack * mult.enemyDamage);
                state.enemies = [nextEnemy];
                state.roomIndex = (state.roomIndex || 0) + 1;
                startTurn(state);
                setMessage("");
                setState({ ...state });
              }}
              onSkip={() => {
                if (!state) return;
                state.pendingReward = undefined;
                const mults: Record<Difficulty, { heroHp: number; enemyDamage: number }> = {
                  easy: { heroHp: 1.2, enemyDamage: 0.8 },
                  normal: { heroHp: 1, enemyDamage: 1 },
                  hard: { heroHp: 0.8, enemyDamage: 1.2 },
                };
                const mult = mults[settings.difficulty];
                const nextEnemyBase = shuffle(monsters.slice(0, 2))[0];
                const nextEnemy = scaleEnemyStats(nextEnemyBase, state.hero.level);
                nextEnemy.attack = Math.floor(nextEnemy.attack * mult.enemyDamage);
                state.enemies = [nextEnemy];
                state.roomIndex = (state.roomIndex || 0) + 1;
                startTurn(state);
                setMessage("");
                setState({ ...state });
              }}
            />
          )}
          {showLevelUp && state && (
            <LevelUpPanel
              level={state.hero.level}
              xp={state.hero.xp}
              maxXp={state.hero.maxXp}
              baseHP={state.hero.baseHP}
              maxEnergy={state.maxEnergy}
              onClose={() => {
                setShowLevelUp(false);
                setGameOver(true);
                setMessage("Victory! All enemies defeated.");
                stopBackgroundMusic();
              }}
            />
          )}
          {gameOver && (
            <div className="game-over">
              <div className="modal">
                <p>{message}</p>
                <button onClick={() => {
                  setSelectedHeroId(null);
                  setState(null);
                  setGameOver(false);
                  setShowLevelUp(false);
                }}>
                  Choose Another Hero
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {optionsOpen && (
        <GameOptions
          settings={settings}
          onSettingsChange={(newSettings) => {
            setSettings(newSettings);
            localStorage.setItem("underCryptSettings", JSON.stringify(newSettings));
            setMusicVolume(newSettings.musicVolume);
            document.documentElement.style.setProperty('--ui-scale', String(newSettings.uiScale));
          }}
          onClose={() => setOptionsOpen(false)}
        />
      )}
    </div>
  );
}
