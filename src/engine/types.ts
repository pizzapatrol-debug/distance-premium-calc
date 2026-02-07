// Zone types
export type Zone = 'Strong' | 'Go' | 'Caution' | 'Stop'

// Zone colors mapping
export const ZONE_COLORS: Record<Zone, string> = {
  Strong: '#5D7A8A',
  Go: '#7A9E7A',
  Caution: '#C4A055',
  Stop: '#B87070',
}

// Zone descriptions (descriptive, not directive)
export const ZONE_DESCRIPTIONS: Record<Zone, string> = {
  Strong: 'Financial comparison shows significant margin',
  Go: 'Financial comparison shows positive margin',
  Caution: 'Financial comparison shows narrow margin',
  Stop: 'Financial comparison shows no margin or negative',
}

// Basic Calculator inputs
export interface BasicInputs {
  corridorComp: number
  localAlt: number
  flights: number
  housing: number
  ground: number
  flightHours: number
  relocationBlocked: boolean
  relocationCost?: number
}

// Year-by-Year inputs
export interface YearByYearInputs {
  years: number
  startingYear: number
  base: number
  bonusPercent: number
  signOn: number[]
  shares: number[]
  stockPrice: number
  local: number[]
  travel: number[]
  tax: number[]
  flightHours: number
}

// Engine input (unified format)
export interface EngineInput {
  years: number
  base: number
  bonusPercent: number
  signOn: number[]
  shares: number[]
  stockPrice: number
  local: number[]
  travel: number[]
  tax: number[]
  flightHours: number
  relocationCost?: number
}

// Per-year results
export interface YearResult {
  year: number
  tc: number
  local: number
  travel: number
  tax: number
  salaryGap: number
  distancePremium: number
  goNoGo: number
  zone: Zone
  skyRate: number | null
  rsuPercent: number
  escapePenalty: number
}

// Breaking points
export interface BreakingPoints {
  corridorFloor: number
  localCeiling: number
  travelCeiling: number
  corridorBuffer: number
  localBuffer: number
  travelBuffer: number
}

// Stock thresholds
export interface StockThresholds {
  strong: number | null
  go: number | null
  caution: number | null
}

// Complete calculation result
export interface CalculationResult {
  years: YearResult[]
  breakingPoints: BreakingPoints
  stockThresholds: StockThresholds[]
  escapeRouteComparison?: {
    salaryGap: number
    relocationCost: number
    lowerCostExit: 'local' | 'relocate'
  }
}
