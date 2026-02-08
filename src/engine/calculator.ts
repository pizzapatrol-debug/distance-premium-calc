import type { 
  EngineInput, 
  CalculationResult, 
  YearResult, 
  Zone, 
  BreakingPoints,
  StockThresholds,
  BasicInputs 
} from './types'

/**
 * Determine zone from Go/No-Go ratio
 * Zone boundaries per spec v2.1:
 * - Strong: > 1.30 (strictly greater)
 * - Go: >= 1.15 and <= 1.30 (includes both boundaries)
 * - Caution: >= 1.00 and < 1.15 (includes 1.00, excludes 1.15)
 * - Stop: < 1.00 (strictly less)
 */
export function getZone(ratio: number): Zone {
  if (ratio > 1.30) return 'Strong'
  if (ratio >= 1.15) return 'Go'
  if (ratio >= 1.00) return 'Caution'
  return 'Stop'
}

/**
 * Calculate Total Compensation for a year
 * TC[year] = Base + (Base × Bonus%) + SignOn[year] + (Shares[year] × StockPrice)
 */
function calculateTC(
  base: number,
  bonusPercent: number,
  signOn: number,
  shares: number,
  stockPrice: number
): number {
  const bonus = base * (bonusPercent / 100)
  const rsuValue = shares * stockPrice
  return base + bonus + signOn + rsuValue
}

/**
 * Calculate RSU dependency percentage
 * RSU%[year] = (Shares[year] × StockPrice) ÷ TC[year] × 100
 */
function calculateRSUPercent(shares: number, stockPrice: number, tc: number): number {
  if (tc === 0) return 0
  const rsuValue = shares * stockPrice
  return (rsuValue / tc) * 100
}

/**
 * Calculate stock price threshold for a target ratio
 * StockThreshold = (TargetRatio × Local + Travel + Tax - Cash) ÷ Shares
 */
function calculateStockThreshold(
  targetRatio: number,
  local: number,
  travel: number,
  tax: number,
  base: number,
  bonusPercent: number,
  signOn: number,
  shares: number
): number | null {
  if (shares === 0) return null
  
  const cash = base + (base * bonusPercent / 100) + signOn
  const required = (targetRatio * local) + travel + tax - cash
  
  const threshold = required / shares
  
  // Return null if threshold would be negative
  return threshold >= 0 ? threshold : null
}

/**
 * Map Basic Calculator inputs to Engine format
 */
export function mapBasicToEngine(inputs: BasicInputs): EngineInput {
  const travelExpense = inputs.flights + inputs.housing + inputs.ground
  
  return {
    years: 1,
    base: inputs.corridorComp,
    bonusPercent: 0,
    signOn: [0],
    shares: [0],
    stockPrice: 0,
    local: [inputs.localAlt],
    travel: [travelExpense],
    tax: [0],
    flightHours: inputs.flightHours,
    relocationCost: inputs.relocationBlocked ? undefined : inputs.relocationCost,
  }
}

/**
 * Main calculation engine
 */
export function calculate(input: EngineInput): CalculationResult {
  const years: YearResult[] = []
  const stockThresholds: StockThresholds[] = []
  
  for (let i = 0; i < input.years; i++) {
    const yearNum = i + 1
    
    // Get per-year values (with fallbacks)
    const signOn = input.signOn[i] ?? 0
    const shares = input.shares[i] ?? 0
    const local = input.local[i] ?? input.local[0] ?? 0
    const travel = input.travel[i] ?? input.travel[0] ?? 0
    const tax = input.tax[i] ?? 0
    
    // Calculate Total Compensation
    const tc = calculateTC(
      input.base,
      input.bonusPercent,
      signOn,
      shares,
      input.stockPrice
    )
    
    // Calculate Salary Gap
    const salaryGap = tc - local
    
    // Calculate Escape Penalty
    // If relocationCost provided, use MIN(salaryGap, relocationCost)
    // Otherwise, escapePenalty = salaryGap
    const escapePenalty = input.relocationCost !== undefined
      ? Math.min(salaryGap, input.relocationCost)
      : salaryGap
    
    // Calculate Distance Premium
    // Distance Premium = Salary Gap - Travel Expense
    const distancePremium = salaryGap - travel
    
    // Calculate Go/No-Go ratio
    // Go/No-Go = (TC - Travel - Tax) / Local
    const corridorNet = tc - travel - tax
    const goNoGo = local > 0 ? corridorNet / local : 0
    
    // Determine zone
    const zone = getZone(goNoGo)
    
    // Calculate Sky Rate
    // Sky Rate = Distance Premium / Flight Hours
    const skyRate = input.flightHours > 0 ? distancePremium / input.flightHours : null
    
    // Calculate RSU percentage
    const rsuPercent = calculateRSUPercent(shares, input.stockPrice, tc)
    
    years.push({
      year: yearNum,
      tc,
      local,
      travel,
      tax,
      salaryGap,
      distancePremium,
      goNoGo,
      zone,
      skyRate,
      rsuPercent,
      escapePenalty,
    })
    
    // Calculate stock thresholds for this year
    const thresholds: StockThresholds = {
      strong: calculateStockThreshold(1.30, local, travel, tax, input.base, input.bonusPercent, signOn, shares),
      go: calculateStockThreshold(1.15, local, travel, tax, input.base, input.bonusPercent, signOn, shares),
      caution: calculateStockThreshold(1.00, local, travel, tax, input.base, input.bonusPercent, signOn, shares),
    }
    stockThresholds.push(thresholds)
  }
  
  // Calculate Breaking Points (using Year 1 values for Basic, or first year for Year-by-Year)
  const firstYear = years[0]
  const breakingPoints: BreakingPoints = {
    // Corridor Floor = Local + Travel
    corridorFloor: firstYear.local + firstYear.travel,
    // Local Ceiling = TC - Travel  
    localCeiling: firstYear.tc - firstYear.travel,
    // Travel Ceiling = Salary Gap
    travelCeiling: firstYear.salaryGap,
    // Buffers
    corridorBuffer: firstYear.tc - (firstYear.local + firstYear.travel),
    localBuffer: (firstYear.tc - firstYear.travel) - firstYear.local,
    travelBuffer: firstYear.salaryGap - firstYear.travel,
  }
  
  // Build result
  const result: CalculationResult = {
    years,
    breakingPoints,
    stockThresholds,
  }
  
  // Add escape route comparison if relocation is available
  if (input.relocationCost !== undefined && firstYear.salaryGap > 0) {
    result.escapeRouteComparison = {
      salaryGap: firstYear.salaryGap,
      relocationCost: input.relocationCost,
      lowerCostExit: firstYear.salaryGap <= input.relocationCost ? 'local' : 'relocate',
    }
  }
  
  return result
}

/**
 * Recalculate with a different stock price (for slider)
 */
export function recalculateWithStockPrice(
  input: EngineInput,
  newStockPrice: number
): CalculationResult {
  return calculate({
    ...input,
    stockPrice: newStockPrice,
  })
}

/**
 * Calculate travel expenses with inflation
 * Travel[year] = BaseTravel × (1 + InflationRate)^(year - 1)
 */
export function calculateTravelWithInflation(
  baseTravel: number,
  inflationRate: number,
  years: number
): number[] {
  const result: number[] = []
  for (let i = 0; i < years; i++) {
    const inflatedTravel = baseTravel * Math.pow(1 + inflationRate / 100, i)
    result.push(Math.round(inflatedTravel))
  }
  return result
}

/**
 * Calculate shares per year from vesting percentages
 */
export function calculateSharesFromVesting(
  totalShares: number,
  vestingPercents: number[]
): number[] {
  return vestingPercents.map(percent => Math.round(totalShares * percent / 100))
}
