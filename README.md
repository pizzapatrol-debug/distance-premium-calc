# Distance Premium Calculator — Basic

A decision-support tool that calculates the financial viability of super-commuting. Built for the 1100 Mile Workday project.

## Overview

This calculator implements the Distance Premium Framework, helping trapped professionals determine whether maintaining a weekly commute corridor makes financial sense.

**What it is:** A decision-support tool that calculates financial viability.

**What it is not:** Advice. The framework gives you the math. The decision is still yours.

## Features

- **Five Core Metrics:** Escape Penalty, Travel Expense, Distance Premium, Sky Rate, Go/No-Go Ratio
- **Visual Zone Indicator:** Shows your position across Strong, Go, Caution, and Stop zones
- **Breaking Points:** Visual display of your financial thresholds and buffers
- **Escape Route Comparison:** Compare staying local vs. relocating (when relocation is available)
- **Privacy-First:** All calculations happen in your browser. No data is stored or transmitted.

## Tech Stack

- React 18
- Vite
- Deployed on Vercel

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for automatic deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push to main

## Version

**v1.5** — January 2026

### Changes in v1.5

- Added consent gate with checkbox acknowledgment
- Updated zone colors to muted traffic-light palette
- Zone descriptions now use descriptive (not directive) language
- Added results disclaimer
- Colorblind accessibility improvements

## License

© 1100 Mile Workday. All rights reserved.

## Disclaimer

This calculator provides estimates for informational purposes only. It does not constitute financial, tax, legal, or career advice. Consult qualified professionals before making decisions affecting your employment, taxes, or family situation.
