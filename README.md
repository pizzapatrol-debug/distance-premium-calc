# Distance Premium Calculator

A decision-support tool for calculating the financial viability of super-commuting, built per the Unified Design Specification v2.1.

## Overview

Two calculators in one codebase:

| Calculator | Tier | Access | Description |
|------------|------|--------|-------------|
| Distance Premium Calculator — Basic | Free | Public | Core five metrics, single-year Go/No-Go |
| Distance Premium Calculator — Year-by-Year | Paid | Subscriber token | Basic metrics + multi-year projection, RSU modeling, tax adjustment |

## Features

### Basic Calculator (/)
- Five core metrics: Escape Penalty, Travel Expense, Distance Premium, Sky Rate, Go/No-Go
- Visual arc bar with zone display (Strong, Go, Caution, Stop)
- Breaking points visualization
- Escape route comparison (when relocation is available)
- Consent gate for legal protection

### Year-by-Year Module (/year-by-year)
- All Basic Calculator features
- Multi-year projection (1-4 years)
- RSU vesting schedule modeling
- Sign-on bonus mapping
- Travel inflation calculation
- Tax adjustment per year
- Stock price slider for scenario exploration
- Token-gated access for paid subscribers

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State:** Local component state (no external state management)
- **Hosting:** Designed for Vercel (free tier)

## Project Structure

```
/src
  /engine
    calculator.ts         ← Shared calculation engine
    types.ts              ← TypeScript types
    index.ts

  /components
    /shared               ← Shared UI components
      ArcGauge.tsx
      MetricsGrid.tsx
      BreakingPoints.tsx
      CurrencyInput.tsx
      NumberInput.tsx
      PercentInput.tsx
      ConsentGate.tsx
      Collapsible.tsx
      Footer.tsx
      ...

    /basic                ← Basic Calculator
      BasicCalculator.tsx
      EscapeRouteComparison.tsx

    /yearByYear           ← Year-by-Year Module (lazy loaded)
      YearByYearCalculator.tsx
      YearTabs.tsx
      ProjectionTable.tsx
      StockSlider.tsx

    TokenGate.tsx
    SubscriberExplanation.tsx

  App.tsx                 ← Main routing
  main.tsx                ← Entry point
  index.css               ← Tailwind + custom styles
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Valid access tokens for Year-by-Year module
# Comma-separated list of valid tokens
# Leave empty for Phase 1 (Basic only)
VITE_VALID_TOKENS=

# For Phase 2+, add hash tokens:
VITE_VALID_TOKENS=a3c7f92b,e91d4f7c
```

### Token Generation

Tokens are hash-based for security:

```javascript
const SECRET = process.env.TOKEN_SECRET // e.g., "1100MW-calc-[random]"

function generateToken(monthYear) {
  const input = monthYear + SECRET  // e.g., "APR2026" + secret
  const hash = SHA256(input)
  return hash.substring(0, 8)       // First 8 characters
}

// Example
generateToken("APR2026") → "a3c7f92b"
```

## Deployment Phases

### Phase 1: Basic Only
```
VITE_VALID_TOKENS=
```
- Basic Calculator: Public, accessible
- Year-by-Year: Shows explanation page

### Phase 2: Year-by-Year Launch
```
VITE_VALID_TOKENS=a3c7f92b
```
- Both calculators accessible
- Subscriber email includes link: `https://calc.1100mileworkday.com/year-by-year?access=a3c7f92b`

### Monthly Token Rotation
```bash
# April
VITE_VALID_TOKENS=a3c7f92b

# May (overlap period)
VITE_VALID_TOKENS=a3c7f92b,e91d4f7c

# June
VITE_VALID_TOKENS=e91d4f7c,7b2e8a1d
```

## Formulas

### Basic Metrics
```
Escape Penalty = Corridor Compensation − Local Alternative (if blocked)
Escape Penalty = MIN(Relocation Cost, Salary Gap) (if available)
Travel Expense = Flights + Housing + Ground Transportation
Distance Premium = Salary Gap − Travel Expense
Sky Rate = Distance Premium ÷ Flight Hours
Go/No-Go = (Corridor Compensation − Travel Expense) ÷ Local Alternative
```

### Zone Boundaries
```
Strong: ratio > 1.30
Go: ratio >= 1.15 && ratio <= 1.30
Caution: ratio >= 1.00 && ratio < 1.15
Stop: ratio < 1.00
```

### Year-by-Year Extensions
```
TC[year] = Base + (Base × Bonus%) + SignOn[year] + (Shares[year] × StockPrice)
Go/No-Go[year] = (TC[year] − Travel[year] − Tax[year]) ÷ Local[year]
StockThreshold = (TargetRatio × Local + Travel + Tax − Cash) ÷ Shares
RSU%[year] = (Shares[year] × StockPrice) ÷ TC[year] × 100
Travel[year] = BaseTravel × (1 + InflationRate)^(year - 1)
```

## Design System

### Colors
| Element | Hex |
|---------|-----|
| Background | #1A1A1A |
| Card | #2A2A2A |
| Border | #3A3A3A |
| Text Primary | #E8E6E3 |
| Text Secondary | #9A9A9A |
| Zone Strong | #5D7A8A |
| Zone Go | #7A9E7A |
| Zone Caution | #C4A055 |
| Zone Stop | #B87070 |

### Typography
- **Sans:** Inter
- **Mono:** SF Mono

## Accessibility

- ARIA roles and labels
- Keyboard navigation
- Screen reader announcements
- Color contrast WCAG AA compliant
- Reduced motion support

## License

Private - 1100 Mile Workday
