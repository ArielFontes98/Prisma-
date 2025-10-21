# Prisma++ | Nubank Data Governance

A modern, single-page React application for data governance at Nubank. Built with shadcn/ui, Tailwind CSS, and TypeScript.

## Features

- **Create**: Guided metric creation with AI-assisted descriptions
- **Validate**: Validation queue with auto-checks and approval workflow
- **Consult**: Discovery and search for canonical metrics
- **Slack**: Bot integration demo and command cheatsheet
- **Integrations**: Mock adapters for Momo, QuickSight, Databricks, KYB, XP
- **Prioritization**: Impact × Effort visualization
- **Roadmap**: 3-phase implementation timeline

## Getting Started

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

## Tech Stack

- React 18
- TypeScript (strict mode)
- Tailwind CSS with Nubank branding
- shadcn/ui components
- Recharts for data visualization
- Lucide React for icons
- Hash routing for GitHub Pages

## Architecture

- Single-page app with tab-based navigation
- All components in `/src/components/`
- Mock data and adapters in `/src/mocks/`
- Client-side only (no backend)

## Design System

**Nubank Color Palette:**
- Purple: `#8A05BE` (nuPurple)
- Deep Purple: `#5C068C` (nuDeep)
- Ink: `#0B0B0E`
- Slate: `#475569`
- Mint: `#D1FAE5`
- Rose: `#FFE4E6`

**Design Principles:**
- Airy typography with generous spacing
- Rounded corners (2xl)
- Soft shadows
- Friendly, modern aesthetic

