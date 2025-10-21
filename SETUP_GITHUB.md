# GitHub SSH Setup & Deployment Guide

## Your SSH Public Key

Copy this key to add to GitHub:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEWYF+kZjnZquNLOYUJSnbCWrtqAUjgFdH87X9ny2tqS ariel.fontes
```

## Step 1: Add SSH Key to GitHub

1. Go to https://github.com/settings/keys
2. Click **"New SSH key"**
3. Give it a title (e.g., "MacBook Ariel")
4. Paste the SSH key above into the "Key" field
5. Click **"Add SSH key"**

## Step 2: Test SSH Connection (After adding key to GitHub)

```bash
ssh -T git@github.com
```

You should see: "Hi ArielFontes98! You've successfully authenticated..."

## Step 3: Push to GitHub (Run these commands)

```bash
cd ~/Prisma-

# Update remote to use SSH instead of HTTPS
git remote set-url origin git@github.com:ArielFontes98/Prisma-.git

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

```bash
cd ~/Prisma-

# Deploy (this will build and push to gh-pages branch)
npm run deploy
```

After deployment completes, your site will be live at:
**https://ArielFontes98.github.io/Prisma-/**

## Troubleshooting

### If SSH connection fails:
```bash
# Check if ssh-agent is running
eval "$(ssh-agent -s)"

# Add your SSH key
ssh-add ~/.ssh/id_ed25519
```

### If you need to create a NEW SSH key:
```bash
# Generate new key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Just press Enter for all prompts (default location, no passphrase)

# Display public key
cat ~/.ssh/id_ed25519.pub
```

## Quick Reference

- **Repository URL**: https://github.com/ArielFontes98/Prisma-
- **Live Site**: https://ArielFontes98.github.io/Prisma-/
- **SSH Remote**: git@github.com:ArielFontes98/Prisma-.git

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

