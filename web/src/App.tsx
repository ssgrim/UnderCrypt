import React, { useState } from 'react';
import { GameState } from './types';
import { loadGameData, startGame, startTurn, playCard, enemyTurn, shuffle } from './gameEngine';
import { cards, heroes, monsters } from './gameData';
import { GameBoard } from './components/GameBoard';
import './App.css';

export function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [targetIdx, setTargetIdx] = useState(0);

  const handleStart = () => {
    const data = loadGameData(cards, heroes, monsters);
    const newState = startGame(data, 'knight_of_ashes');
    newState.enemies = [{ ...shuffle(monsters.slice(0, 2))[0] }];
    setState(newState);
    setGameOver(false);
    setMessage('');
  };

  const handlePlayCard = (handIndex: number, target: number) => {
    if (!state) return;
    try {
      playCard(state, handIndex, target);
      setState({ ...state });
      setMessage('');
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleEndTurn = () => {
    if (!state) return;

    // Remove dead enemies
    state.enemies = state.enemies.filter((e) => e.hp > 0);

    if (state.enemies.length === 0) {
      setGameOver(true);
      setMessage('Victory! All enemies defeated.');
      return;
    }

    // Enemy turn
    enemyTurn(state);
    setState({ ...state });

    if (state.hero.hp <= 0) {
      setGameOver(true);
      setMessage(`Defeat! Hero HP reached 0.`);
      return;
    }

    // Start new turn
    startTurn(state);
    setState({ ...state });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>UnderCrypt - Web Demo</h1>
        {state && (
          <button className="start-btn" onClick={handleStart}>
            New Game
          </button>
        )}
      </header>

      {!state ? (
        <div className="start-screen">
          <h2>Welcome to UnderCrypt</h2>
          <p>A deck-building dungeon crawler</p>
          <button className="start-btn" onClick={handleStart}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="game-container">
          <GameBoard state={state} onPlayCard={handlePlayCard} onEndTurn={handleEndTurn} />
          {message && <div className="message">{message}</div>}
          {gameOver && (
            <div className="game-over">
              <div className="modal">
                <p>{message}</p>
                <button onClick={handleStart}>Play Again</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
