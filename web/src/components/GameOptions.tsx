import React, { useState } from 'react';
import './GameOptions.css';

interface GameSettings {
  difficulty: 'easy' | 'normal' | 'hard';
  musicVolume: number;
  gameSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
}

interface Props {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

export function GameOptions({ settings, onSettingsChange, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleDifficultyChange = (difficulty: GameSettings['difficulty']) => {
    const updated = { ...localSettings, difficulty };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleVolumeChange = (musicVolume: number) => {
    const updated = { ...localSettings, musicVolume };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleSpeedChange = (gameSpeed: GameSettings['gameSpeed']) => {
    const updated = { ...localSettings, gameSpeed };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleSoundToggle = () => {
    const updated = { ...localSettings, soundEnabled: !localSettings.soundEnabled };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        alert('Could not enter fullscreen mode');
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="game-options-overlay" onClick={onClose}>
      <div className="game-options-modal" onClick={(e) => e.stopPropagation()}>
        <div className="options-header">
          <h2>Game Options</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="options-content">
          {/* Difficulty Section */}
          <div className="option-section">
            <h3>Difficulty</h3>
            <div className="difficulty-buttons">
              {(['easy', 'normal', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  className={`difficulty-btn ${localSettings.difficulty === level ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="difficulty-desc">
              {localSettings.difficulty === 'easy'
                ? 'Start with extra health, enemies deal less damage'
                : localSettings.difficulty === 'hard'
                  ? 'Start with less health, enemies deal more damage'
                  : 'Balanced gameplay experience'}
            </p>
          </div>

          {/* Volume Section */}
          <div className="option-section">
            <h3>Music Volume</h3>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="100"
                value={localSettings.musicVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="volume-slider"
              />
              <span className="volume-value">{Math.round(localSettings.musicVolume)}%</span>
            </div>
          </div>

          {/* Game Speed Section */}
          <div className="option-section">
            <h3>Game Speed</h3>
            <div className="speed-buttons">
              {(['slow', 'normal', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  className={`speed-btn ${localSettings.gameSpeed === speed ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="option-section">
            <h3>Sound Effects</h3>
            <div className="toggle-switch">
              <button
                className={`toggle-btn ${localSettings.soundEnabled ? 'enabled' : 'disabled'}`}
                onClick={handleSoundToggle}
              >
                {localSettings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
              </button>
            </div>
          </div>

          {/* Fullscreen */}
          <div className="option-section">
            <h3>Display</h3>
            <button className="fullscreen-btn" onClick={handleFullscreen}>
              ⛶ Toggle Fullscreen
            </button>
          </div>
        </div>

        <div className="options-footer">
          <button className="close-options-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
