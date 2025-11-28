# Deploy UnderCrypt to Vercel (5 minutes)

Your game is ready to deploy! Follow these steps to get a shareable URL.

## Step 1: Create GitHub Repository (if you don't have one)

1. Go to https://github.com/new
2. Create a new repository called `UnderCrypt`
3. Don't initialize with README (we already have one)

## Step 2: Push Your Code to GitHub

Run these commands in your project directory:

```powershell
git remote add origin https://github.com/<YOUR-USERNAME>/UnderCrypt.git
git branch -M main
git push -u origin main
```

Replace `<YOUR-USERNAME>` with your actual GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Select your `UnderCrypt` repository
4. Under "Project Settings":
   - **Root Directory**: Set to `web`
   - Leave everything else as default
5. Click "Deploy"

**That's it!** Vercel will automatically build and deploy your game.

## Step 4: Get Your Shareable URL

After deployment completes, you'll see your live URL in the format:
```
https://undercrypt-<random>.vercel.app
```

Share this URL with your nephew! 🎮

## Automatic Updates

Every time you push code to GitHub:
```powershell
git add -A
git commit -m "Your changes"
git push
```

Vercel will **automatically rebuild and deploy** your changes. No manual steps needed!

## Troubleshooting

**If deployment fails:**
1. Go to your Vercel dashboard
2. Click on your project
3. Check the "Deployments" tab for error messages
4. Common fix: Make sure `web/` folder has a `package.json` (it does ✓)

**If you want to redeploy:**
- Go to Vercel dashboard → Your project → Deployments
- Click the "..." menu on the latest deployment
- Select "Redeploy"

## What Happens Under the Hood

Vercel will:
1. ✓ Install dependencies from `web/package.json`
2. ✓ Run `npm run build` automatically
3. ✓ Serve the built files from `web/dist/`
4. ✓ Give you a permanent URL

Your game is now accessible from anywhere in the world! 🌍
