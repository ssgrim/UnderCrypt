# UnderCrypt Web Demo

A mobile-optimized deck-building roguelike with dungeon exploration and strategic combat.

## Setup & Run

```powershell
cd web
npm install
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
```

## How to Play

1. **Hero Selection** — Choose your hero (Knight, Mage, or Rogue)
2. **Dungeon Map** — Select rooms to explore; see enemy previews before entering
3. **Combat** — Play cards from your hand (costs energy) to defeat enemies
4. **Rewards** — Choose 1 of 3 cards after victory to improve your deck
5. **Progress** — Complete all rooms to advance to the next act

## Features

### Combat System
- **24 unique cards** with varied effects (attacks, defense, spells, utilities)
- **Status effects** — Poison, Freeze, Burn, Chill
- **Energy management** — Starts at 3, increases with level
- **Block system** — Reduces incoming damage each turn

### Progression
- **XP & Leveling** — Gain XP from battles, level up for stat boosts
- **Dungeon exploration** — Strategic room selection with monster previews
- **Room types** — Battle, Elite, Boss, Shop (placeholder), Event (placeholder)
- **7 monster types** — 3 Minions, 2 Elites, 2 Bosses

### Polish
- **Mobile responsive** — Optimized for phones and tablets
- **UI scaling** — Adjustable from 0.9x to 1.5x via options
- **Dynamic difficulty** — Enemies scale with hero level (8% HP, 5% attack per level)

## Files

- `src/gameEngine.ts` — Core game logic (ported from CLI)
- `src/components/GameBoard.tsx` — Main game UI component
- `src/App.tsx` — Game state management and lifecycle
- `src/gameData.ts` — Sample cards, heroes, monsters

To expand the game:

- Add more cards and monsters to `gameData.ts`
- Enhance effects in `gameEngine.ts`
- Improve UI styling in `GameBoard.css` and `App.css`
