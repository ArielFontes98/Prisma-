# GitHub Account Mismatch - How to Fix

## The Issue

Your SSH key is authenticated as: **ArielFontes2198**
But the repository URL is: **ArielFontes98/Prisma-**

## Solution Options

### Option 1: Use Your Current GitHub Account (ArielFontes2198)

Update the repository URL to match your actual GitHub account:

```bash
cd ~/Prisma-

# Update to correct username
git remote set-url origin git@github.com:ArielFontes2198/Prisma-.git

# Create the repository on GitHub first:
# Go to: https://github.com/new
# Repository name: Prisma-
# Make it public
# DO NOT initialize with README

# Then push
git push -u origin main
```

After pushing, update these files to match your username:

**package.json** - Update line 5:
```json
"homepage": "https://ArielFontes2198.github.io/Prisma-",
```

**src/App.tsx** - Update GitHub link (line ~25):
```tsx
href="https://github.com/ArielFontes2198/Prisma-"
```

Then commit and push the changes:
```bash
git add -A
git commit -m "Fix GitHub username in config"
git push
```

### Option 2: Add SSH Key to ArielFontes98 Account

If you want to use the ArielFontes98 account instead:

1. Log into GitHub as **ArielFontes98**
2. Go to https://github.com/settings/keys
3. Add this SSH key:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEWYF+kZjnZquNLOYUJSnbCWrtqAUjgFdH87X9ny2tqS ariel.fontes
```
4. Create repository at https://github.com/new (name: Prisma-)
5. Push:
```bash
cd ~/Prisma-
git push -u origin main
```

## Recommended: Option 1 (Use ArielFontes2198)

This is simpler since your SSH key is already set up with this account.

