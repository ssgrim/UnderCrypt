# UnderCrypt (demo)

Minimal scaffold for the UnderCrypt game (deck-building roguelike).

## Play Online

🎮 **Want to play now?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for options to share the web version with others!

## Local Development

1. Install dependencies

```powershell
npm install
```

2. Run tests

```powershell
npm test
```

3. Start demo CLI

```powershell
npm start
```

4. Play the web version locally

```powershell
cd web
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Files of Interest

- `src/lib/game-engine.ts` — minimal engine
- `data/*.json` — sample cards, heroes, monsters
- `tests/*` — basic tests using `vitest` (all passing ✓)
- `web/src/` — React web interface
- `DEPLOYMENT.md` — instructions to share the game online
