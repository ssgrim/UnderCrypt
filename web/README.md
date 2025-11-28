# UnderCrypt Web Demo

A minimal Vite + React web UI for playing UnderCrypt (deck-building roguelike).

## Setup & Run

```powershell
cd web
npm install
npm run dev
```

The browser should open automatically at http://localhost:3000.

## How to Play

1. Click **Start Game** to begin.
2. Click cards in your hand to play them (if you have enough energy).
3. Click **End Turn** to let the enemy attack.
4. Defeat all enemies or game over when your HP reaches 0.

## Features

- Click-to-play card UI
- Hero HP and block tracking
- Enemy health bars
- Energy management
- Victory/defeat modal

## Files

- `src/gameEngine.ts` — Core game logic (ported from CLI)
- `src/components/GameBoard.tsx` — Main game UI component
- `src/App.tsx` — Game state management and lifecycle
- `src/gameData.ts` — Sample cards, heroes, monsters

To expand the game:

- Add more cards and monsters to `gameData.ts`
- Enhance effects in `gameEngine.ts`
- Improve UI styling in `GameBoard.css` and `App.css`
