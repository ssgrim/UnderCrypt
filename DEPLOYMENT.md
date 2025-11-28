# UnderCrypt Web Deployment Guide

Your UnderCrypt web app is now built and ready to share! The production-ready files are in `web/dist/`.

## Quick Start Options

### Option 1: Deploy to GitHub Pages (FREE, Recommended)

1. Push your project to GitHub (if not already):

   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to GitHub repository Settings → Pages

3. Set "Source" to "Deploy from a branch"

4. Select branch: `main` and folder: `web/dist`

5. Save - GitHub will automatically deploy your site to:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

6. Share this link with your nephew!

### Option 2: Deploy to Vercel (FREE, Very Easy)

1. Go to https://vercel.com

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Set Root Directory to `web`

5. Click Deploy

6. Your site will be live at `https://<project-name>.vercel.app`

### Option 3: Deploy to Netlify (FREE)

1. Go to https://netlify.com

2. Click "Add new site" → "Import an existing project"

3. Connect GitHub and select your repository

4. Build command: `npm run build`

5. Publish directory: `web/dist`

6. Deploy - your site will be live immediately

### Option 4: Local Network Sharing (No Setup)

If you just want to share on your local network quickly:

```powershell
cd web
npm run preview -- --host 0.0.0.0
```

Then share your IP address with your nephew:

- Find your IP: Open PowerShell and run `ipconfig`
- Look for "IPv4 Address" (usually 192.168.x.x)
- Share: `http://<your-ip>:4173/`

## Rebuilding After Changes

After making any changes to the game code:

1. **From root**, rebuild the core game engine:

   ```powershell
   npm run build
   ```

2. Navigate to web folder and rebuild:

   ```powershell
   cd web
   npm run build
   ```

3. Re-deploy using your chosen hosting method

## Project Structure

- `src/lib/game-engine.ts` - Core game logic (tested ✓)
- `web/src/` - React web interface
- `web/dist/` - Production build (ready to deploy)
- `data/` - Game data (cards, heroes, monsters)
- `tests/` - Test suite (all passing ✓)

## What's Been Done

✓ Dependencies installed
✓ All tests passing
✓ Web app built for production
✓ Local preview tested and working

You're all set to share with your nephew! Choose any deployment option above.
