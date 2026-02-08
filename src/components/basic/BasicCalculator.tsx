import { useState, useMemo } from 'react'
import { 
  CurrencyInput, 
  NumberInput, 
  ArcGauge, 
  MetricsGrid, 
  BreakingPoints,
  Footer,
  ResultsDisclaimer,
  Toggle,
} from '../shared'
import { EscapeRouteComparison } from './EscapeRouteComparison'
import { calculate, mapBasicToEngine, BasicInputs } from '../../engine'

export function BasicCalculator() {
  // Input state
  const [relocationBlocked, setRelocationBlocked] = useState(true)
  const [corridorComp, setCorridorComp] = useState<number | null>(null)
  const [localAlt, setLocalAlt] = useState<number | null>(null)
  const [relocationCost, setRelocationCost] = useState<number | null>(null)
  const [flights, setFlights] = useState<number | null>(null)
  const [housing, setHousing] = useState<number | null>(null)
  const [ground, setGround] = useState<number | null>(null)
  const [flightHours, setFlightHours] = useState<number | null>(null)
  
  // Calculate results
  const result = useMemo(() => {
    // Need at least corridor comp and local alt to calculate
    if (corridorComp === null || localAlt === null) {
      return null
    }
    
    const inputs: BasicInputs = {
      corridorComp,
      localAlt,
      flights: flights ?? 0,
      housing: housing ?? 0,
      ground: ground ?? 0,
      flightHours: flightHours ?? 0,
      relocationBlocked,
      relocationCost: relocationBlocked ? undefined : (relocationCost ?? undefined),
    }
    
    const engineInput = mapBasicToEngine(inputs)
    return calculate(engineInput)
  }, [corridorComp, localAlt, flights, housing, ground, flightHours, relocationBlocked, relocationCost])
  
  // Derived values for display
  const isEmpty = result === null
  const yearData = result?.years[0]
  const hasValidSalaryGap = yearData && yearData.salaryGap > 0
  
  // Edge case messages
  const edgeCaseMessage = useMemo(() => {
    if (!yearData) return null
    
    if (yearData.salaryGap <= 0) {
      return "No salary gap exists. The local alternative pays equal or more."
    }
    
    const travelExpense = (flights ?? 0) + (housing ?? 0) + (ground ?? 0)
    if (travelExpense > yearData.salaryGap) {
      return "Travel costs exceed the salary gap. The corridor is not viable."
    }
    
    return null
  }, [yearData, flights, housing, ground])
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sticky Header with Arc Gauge */}
      <div className="sticky top-0 z-40 bg-bg-primary border-b border-border-primary">
        <div className="max-w-calculator mx-auto px-4 py-4">
          {/* Title */}
          <h1 className="text-xl font-medium text-text-primary mb-1">
            Distance Premium Calculator
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            All calculations happen in your browser. No data is stored or transmitted.
          </p>
          
          {/* Arc Gauge */}
          <ArcGauge 
            ratio={yearData?.goNoGo ?? null}
            zone={yearData?.zone ?? null}
            isEmpty={isEmpty}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-calculator mx-auto px-4 py-6 space-y-6">
        {/* Results Disclaimer - Always visible */}
        <ResultsDisclaimer />
        
        {/* Results Section */}
        <section className="space-y-6">
          {isEmpty ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">
                Enter values below to calculate.
              </p>
            </div>
          ) : edgeCaseMessage ? (
            <div className="text-center py-8">
              <p className="text-zone-caution">
                {edgeCaseMessage}
              </p>
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div>
                <h2 className="text-xxs font-semibold text-accent uppercase tracking-wide mb-4">
                  Results
                </h2>
                <MetricsGrid
                  escapePenalty={yearData?.escapePenalty ?? null}
                  travelExpense={(flights ?? 0) + (housing ?? 0) + (ground ?? 0) || null}
                  distancePremium={hasValidSalaryGap ? yearData?.distancePremium ?? null : null}
                  skyRate={hasValidSalaryGap ? yearData?.skyRate ?? null : null}
                  isEmpty={isEmpty}
                />
              </div>
              
              {/* Breaking Points */}
              {hasValidSalaryGap && result && (
                <BreakingPoints
                  corridorFloor={result.breakingPoints.corridorFloor}
                  corridorBuffer={result.breakingPoints.corridorBuffer}
                  localCeiling={result.breakingPoints.localCeiling}
                  localBuffer={result.breakingPoints.localBuffer}
                  travelCeiling={result.breakingPoints.travelCeiling}
                  travelBuffer={result.breakingPoints.travelBuffer}
                  corridorComp={corridorComp}
                  localAlt={localAlt}
                  travelExpense={(flights ?? 0) + (housing ?? 0) + (ground ?? 0)}
                  isEmpty={isEmpty}
                />
              )}
              
              {/* Escape Route Comparison - Only when relocation is available */}
              {!relocationBlocked && result?.escapeRouteComparison && hasValidSalaryGap && (
                <EscapeRouteComparison
                  salaryGap={result.escapeRouteComparison.salaryGap}
                  relocationCost={result.escapeRouteComparison.relocationCost}
                  lowerCostExit={result.escapeRouteComparison.lowerCostExit}
                />
              )}
            </>
          )}
        </section>
        
        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-xxs font-semibold text-accent uppercase tracking-wide">
            Inputs
          </h2>
          
          {/* Relocation Toggle */}
          <Toggle
            options={[
              { value: 'blocked', label: 'Blocked' },
              { value: 'available', label: 'Available' },
            ]}
            value={relocationBlocked ? 'blocked' : 'available'}
            onChange={(val) => setRelocationBlocked(val === 'blocked')}
            label="Is relocation to the hub city blocked or available?"
            helpText="Custody, eldercare, spouse career, or mortgage lock can block relocation."
          />
          
          {/* Compensation Inputs */}
          <div className="space-y-4">
            <CurrencyInput
              label="Corridor Compensation"
              value={corridorComp}
              onChange={setCorridorComp}
              helpText="Annual TC at hub city (base + bonus + equity), e.g., 450,000"
            />
            
            <CurrencyInput
              label="Local Alternative"
              value={localAlt}
              onChange={setLocalAlt}
              helpText="Best available TC in the local market, e.g., 300,000"
            />
            
            {/* Relocation Cost - Only when Available */}
            {!relocationBlocked && (
              <CurrencyInput
                label="Relocation Cost"
                value={relocationCost}
                onChange={setRelocationCost}
                helpText="Annual housing increase to relocate family to hub city, e.g., 60,000"
              />
            )}
          </div>
          
          {/* Travel Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Travel Expenses</h3>
            
            <CurrencyInput
              label="Flights"
              value={flights}
              onChange={setFlights}
              helpText="Total airfare per year, e.g., 16,000"
            />
            
            <CurrencyInput
              label="Housing"
              value={housing}
              onChange={setHousing}
              helpText="Rent and utilities in hub city, e.g., 21,000"
            />
            
            <CurrencyInput
              label="Ground Transportation"
              value={ground}
              onChange={setGround}
              helpText="Rideshare, parking, car costs, e.g., 7,000"
            />
          </div>
          
          {/* Flight Hours */}
          <NumberInput
            label="Flight Hours"
            value={flightHours}
            onChange={setFlightHours}
            helpText="Total hours in the air per year, e.g., 260"
          />
        </section>
        
        {/* Newsletter Callout */}
        <section className="py-6 border-t border-border-primary">
          <p className="text-sm font-medium text-text-primary mb-1">
            Need Year-by-Year projection?
          </p>
          <a 
            href="https://1100mileworkday.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            1100 Mile Workday →
          </a>
          <p className="text-xs text-text-secondary mt-1">
            Paid subscribers get the Year-by-Year module.
          </p>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
