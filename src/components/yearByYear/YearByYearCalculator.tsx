import { useState, useMemo, useCallback } from 'react'
import { calculate, calculateTravelWithInflation } from '../../engine'
import type { EngineInput, CalculationResult } from '../../engine'
import {
  CurrencyInput,
  NumberInput,
  PercentInput,
  ArcGauge,
  MetricsGrid,
  BreakingPoints,
  ResultsDisclaimer,
  Footer,
  Collapsible,
} from '../shared'
import { YearTabs } from './YearTabs'
import { ProjectionTable } from './ProjectionTable'
import { StockSlider } from './StockSlider'

const CURRENT_YEAR = new Date().getFullYear()

export function YearByYearCalculator() {
  // Timeline state
  const [startingYear, setStartingYear] = useState(CURRENT_YEAR)
  const [yearsToModel, setYearsToModel] = useState(4)
  
  // Corridor compensation state
  const [baseSalary, setBaseSalary] = useState<number | null>(null)
  const [bonusPercent, setBonusPercent] = useState<number | null>(null)
  const [stockPrice, setStockPrice] = useState<number | null>(null)
  const [sharesPerYear, setSharesPerYear] = useState<(number | null)[]>([null, null, null, null])
  const [signOnPerYear, setSignOnPerYear] = useState<(number | null)[]>([null, null, null, null])
  
  // Vesting calculator state
  const [totalShares, setTotalShares] = useState<number | null>(null)
  const [vestingPercents, setVestingPercents] = useState<(number | null)[]>([null, null, null, null])
  
  // Local alternative state
  const [localAlt, setLocalAlt] = useState<number | null>(null)
  const [localPerYear, setLocalPerYear] = useState<(number | null)[]>([null, null, null, null])
  const [localDifferentPerYear, setLocalDifferentPerYear] = useState(false)
  
  // Travel state
  const [baseTravel, setBaseTravel] = useState<number | null>(null)
  const [inflationRate, setInflationRate] = useState<number | null>(5)
  const [travelPerYear, setTravelPerYear] = useState<(number | null)[]>([null, null, null, null])
  const [travelDifferentPerYear, setTravelDifferentPerYear] = useState(false)
  
  // Tax state
  const [taxAmount, setTaxAmount] = useState<number | null>(0)
  const [taxPerYear, setTaxPerYear] = useState<(number | null)[]>([null, null, null, null])
  const [taxDifferentPerYear, setTaxDifferentPerYear] = useState(false)
  
  // Flight hours
  const [flightHours, setFlightHours] = useState<number | null>(null)
  
  // Stock slider state
  const [sliderStockPrice, setSliderStockPrice] = useState<number | null>(null)
  
  // Selected year for display
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)
  
  // Calendar years based on starting year
  const calendarYears = useMemo(() => {
    return Array.from({ length: yearsToModel }, (_, i) => startingYear + i)
  }, [startingYear, yearsToModel])
  
  // Calculate travel per year with inflation
  const calculatedTravelPerYear = useMemo(() => {
    if (travelDifferentPerYear) {
      return travelPerYear.slice(0, yearsToModel).map(t => t ?? 0)
    }
    if (baseTravel === null) return Array(yearsToModel).fill(0)
    return calculateTravelWithInflation(baseTravel, inflationRate ?? 0, yearsToModel)
  }, [baseTravel, inflationRate, yearsToModel, travelDifferentPerYear, travelPerYear])
  
  // Calculate local per year
  const calculatedLocalPerYear = useMemo(() => {
    if (localDifferentPerYear) {
      return localPerYear.slice(0, yearsToModel).map(l => l ?? localAlt ?? 0)
    }
    return Array(yearsToModel).fill(localAlt ?? 0)
  }, [localAlt, yearsToModel, localDifferentPerYear, localPerYear])
  
  // Calculate tax per year
  const calculatedTaxPerYear = useMemo(() => {
    if (taxDifferentPerYear) {
      return taxPerYear.slice(0, yearsToModel).map(t => t ?? taxAmount ?? 0)
    }
    return Array(yearsToModel).fill(taxAmount ?? 0)
  }, [taxAmount, yearsToModel, taxDifferentPerYear, taxPerYear])
  
  // Effective stock price (slider or input)
  const effectiveStockPrice = sliderStockPrice ?? stockPrice ?? 0
  
  // Stock price change percentage for display
  const stockPriceChange = useMemo(() => {
    if (sliderStockPrice === null || stockPrice === null || stockPrice === 0) return null
    return ((sliderStockPrice - stockPrice) / stockPrice) * 100
  }, [sliderStockPrice, stockPrice])
  
  // Build engine input and calculate
  const result = useMemo((): CalculationResult | null => {
    // Need minimum inputs
    if (baseSalary === null || localAlt === null) {
      return null
    }
    
    const engineInput: EngineInput = {
      years: yearsToModel,
      base: baseSalary,
      bonusPercent: bonusPercent ?? 0,
      signOn: signOnPerYear.slice(0, yearsToModel).map(s => s ?? 0),
      shares: sharesPerYear.slice(0, yearsToModel).map(s => s ?? 0),
      stockPrice: effectiveStockPrice,
      local: calculatedLocalPerYear,
      travel: calculatedTravelPerYear,
      tax: calculatedTaxPerYear,
      flightHours: flightHours ?? 0,
    }
    
    return calculate(engineInput)
  }, [
    baseSalary, 
    bonusPercent, 
    effectiveStockPrice, 
    sharesPerYear, 
    signOnPerYear,
    calculatedLocalPerYear,
    calculatedTravelPerYear,
    calculatedTaxPerYear,
    flightHours,
    yearsToModel,
    localAlt,
  ])
  
  // Selected year data
  const selectedYearData = result?.years[selectedYearIndex]
  const selectedYearThresholds = result?.stockThresholds[selectedYearIndex]
  
  // Check if we have enough data to show results
  const isEmpty = result === null
  const hasShares = sharesPerYear.slice(0, yearsToModel).some(s => s !== null && s > 0)
  
  // Apply vesting calculation to shares per year
  const applyVestingCalculation = useCallback(() => {
    if (totalShares === null) return
    
    const calculated = vestingPercents.map(percent => {
      if (percent === null) return null
      return Math.round(totalShares * percent / 100)
    })
    setSharesPerYear(calculated)
  }, [totalShares, vestingPercents])
  
  // Vesting validation
  const vestingTotal = useMemo(() => {
    return vestingPercents.reduce<number>((sum, p) => sum + (p ?? 0), 0)
  }, [vestingPercents])
  const vestingValid = vestingTotal === 100
  
  // Clear all inputs
  const handleClearAll = () => {
    setBaseSalary(null)
    setBonusPercent(null)
    setStockPrice(null)
    setSharesPerYear([null, null, null, null])
    setSignOnPerYear([null, null, null, null])
    setTotalShares(null)
    setVestingPercents([null, null, null, null])
    setLocalAlt(null)
    setLocalPerYear([null, null, null, null])
    setLocalDifferentPerYear(false)
    setBaseTravel(null)
    setInflationRate(5)
    setTravelPerYear([null, null, null, null])
    setTravelDifferentPerYear(false)
    setTaxAmount(0)
    setTaxPerYear([null, null, null, null])
    setTaxDifferentPerYear(false)
    setFlightHours(null)
    setSliderStockPrice(null)
    setSelectedYearIndex(0)
  }
  
  // Handle slider price change
  const handleSliderPriceChange = (price: number) => {
    setSliderStockPrice(price)
  }
  
  // Reset slider to current price
  const resetSlider = () => {
    setSliderStockPrice(null)
  }
  
  // Update shares for a specific year
  const updateSharesYear = (index: number, value: number | null) => {
    const newShares = [...sharesPerYear]
    newShares[index] = value
    setSharesPerYear(newShares)
  }
  
  // Update sign-on for a specific year
  const updateSignOnYear = (index: number, value: number | null) => {
    const newSignOn = [...signOnPerYear]
    newSignOn[index] = value
    setSignOnPerYear(newSignOn)
  }
  
  // Update vesting percent for a year
  const updateVestingPercent = (index: number, value: number | null) => {
    const newPercents = [...vestingPercents]
    newPercents[index] = value
    setVestingPercents(newPercents)
  }
  
  // Update local per year
  const updateLocalYear = (index: number, value: number | null) => {
    const newLocal = [...localPerYear]
    newLocal[index] = value
    setLocalPerYear(newLocal)
  }
  
  // Update travel per year
  const updateTravelYear = (index: number, value: number | null) => {
    const newTravel = [...travelPerYear]
    newTravel[index] = value
    setTravelPerYear(newTravel)
  }
  
  // Update tax per year
  const updateTaxYear = (index: number, value: number | null) => {
    const newTax = [...taxPerYear]
    newTax[index] = value
    setTaxPerYear(newTax)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Compact Sticky Header - Just Gauge and Year Tabs */}
      <div className="sticky top-0 z-40 bg-bg-primary border-b border-border-primary">
        <div className="max-w-calculator mx-auto px-4 py-3">
          {/* Year Tabs - Only show when we have results */}
          {!isEmpty && (
            <div className="mb-3">
              <YearTabs
                years={calendarYears}
                selectedYear={calendarYears[selectedYearIndex]}
                onSelectYear={(year) => setSelectedYearIndex(calendarYears.indexOf(year))}
              />
            </div>
          )}
          
          {/* Compact Arc Gauge */}
          <ArcGauge 
            ratio={selectedYearData?.goNoGo ?? null}
            zone={selectedYearData?.zone ?? null}
            isEmpty={isEmpty}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-calculator mx-auto px-4 py-6 space-y-6">
        {/* Title Section - Non-sticky */}
        <div>
          <h1 className="text-xl font-medium text-text-primary mb-1">
            Distance Premium Calculator
          </h1>
          <p className="text-sm text-text-secondary">
            Year-by-Year Module
          </p>
          <p className="text-xs text-text-secondary mt-2">
            All calculations happen in your browser. No data is stored or transmitted.
          </p>
        </div>
        
        {/* Results Disclaimer */}
        <ResultsDisclaimer />
        
        {/* Results Section */}
        <section className="space-y-6">
          {isEmpty ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">
                Enter compensation details below to project year-by-year viability.
              </p>
            </div>
          ) : (
            <>
              {/* Basic Metrics for Selected Year */}
              <div>
                <h2 className="text-xxs font-semibold text-accent uppercase tracking-wide mb-4">
                  Results ({calendarYears[selectedYearIndex]})
                </h2>
                <MetricsGrid
                  escapePenalty={selectedYearData?.escapePenalty ?? null}
                  travelExpense={selectedYearData?.travel ?? null}
                  distancePremium={selectedYearData?.distancePremium ?? null}
                  skyRate={selectedYearData?.skyRate ?? null}
                  isEmpty={isEmpty}
                />
              </div>
              
              {/* Breaking Points for Selected Year */}
              {result && selectedYearData && (
                <BreakingPoints
                  corridorFloor={selectedYearData.local + selectedYearData.travel}
                  corridorBuffer={selectedYearData.tc - (selectedYearData.local + selectedYearData.travel)}
                  localCeiling={selectedYearData.tc - selectedYearData.travel}
                  localBuffer={(selectedYearData.tc - selectedYearData.travel) - selectedYearData.local}
                  travelCeiling={selectedYearData.salaryGap}
                  travelBuffer={selectedYearData.salaryGap - selectedYearData.travel}
                  corridorComp={selectedYearData.tc}
                  localAlt={selectedYearData.local}
                  travelExpense={selectedYearData.travel}
                  isEmpty={isEmpty}
                />
              )}
              
              {/* Projection Section */}
              <div className="space-y-4">
                <h2 className="text-xxs font-semibold text-accent uppercase tracking-wide">
                  Projection
                </h2>
                
                {/* Projection Table */}
                {result && (
                  <ProjectionTable
                    years={result.years}
                    startingYear={startingYear}
                    selectedYearIndex={selectedYearIndex}
                    stockPrice={effectiveStockPrice}
                    stockPriceChange={stockPriceChange}
                  />
                )}
                
                {/* Stock Slider - More prominent when shares exist */}
                {hasShares && selectedYearThresholds && selectedYearData && (
                  <div className="p-4 bg-bg-card border border-border-primary rounded-lg space-y-4">
                    <h3 className="text-sm font-medium text-text-primary">
                      Stock Price Sensitivity
                    </h3>
                    <StockSlider
                      currentPrice={effectiveStockPrice}
                      thresholds={selectedYearThresholds}
                      currentZone={selectedYearData.zone}
                      currentRatio={selectedYearData.goNoGo}
                      onPriceChange={handleSliderPriceChange}
                    />
                    {sliderStockPrice !== null && (
                      <button
                        onClick={resetSlider}
                        className="text-sm text-accent hover:underline"
                      >
                        Reset to current price
                      </button>
                    )}
                  </div>
                )}
                
                {/* Scope Note */}
                <p className="text-xs text-text-secondary italic">
                  This module does not calculate Escape Route Comparison. Use Basic Calculator for that.
                </p>
              </div>
            </>
          )}
        </section>
        
        {/* ============================================ */}
        {/* INPUTS SECTION - Organized into clear cards */}
        {/* ============================================ */}
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xxs font-semibold text-accent uppercase tracking-wide">
              Inputs
            </h2>
            <button
              onClick={handleClearAll}
              className="text-sm text-text-secondary hover:underline"
            >
              Clear all
            </button>
          </div>
          
          {/* Timeline */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg">
            <h3 className="text-sm font-medium text-text-primary mb-4">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">
                  Starting Year
                </label>
                <select
                  value={startingYear}
                  onChange={(e) => setStartingYear(parseInt(e.target.value))}
                  className="h-12 px-3 bg-bg-input border border-border-primary rounded-md 
                             text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - 2 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">
                  Years to Model
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => setYearsToModel(n)}
                      className={`
                        flex-1 h-12 rounded-md text-sm font-medium
                        border
                        ${yearsToModel === n
                          ? 'bg-accent border-accent text-text-primary'
                          : 'bg-bg-card border-border-primary text-text-secondary hover:border-accent/50'
                        }
                      `}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* ==================== */}
          {/* CORRIDOR COMPENSATION */}
          {/* ==================== */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Corridor Compensation</h3>
            
            <CurrencyInput
              label="Base Salary"
              value={baseSalary}
              onChange={setBaseSalary}
              helpText="Annual base salary"
            />
            
            <CurrencyInput
              label="Stock Price"
              value={stockPrice}
              onChange={(val) => {
                setStockPrice(val)
                setSliderStockPrice(null)
              }}
              helpText="Current stock price"
            />
            
            {/* RSU Section - Shares + Calculator together */}
            <div className="border border-border-primary rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-bg-highlight">
                <span className="text-sm font-medium text-text-primary">RSU / Equity</span>
              </div>
              <div className="px-4 py-4 space-y-4">
                {/* Shares Per Year */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Shares Vesting Per Year
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {calendarYears.map((year, index) => (
                      <NumberInput
                        key={year}
                        label={year.toString()}
                        value={sharesPerYear[index]}
                        onChange={(val) => updateSharesYear(index, val)}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">From equity statement, or use calculator below</p>
                </div>
                
                {/* Vesting Calculator */}
                <div className="pt-3 border-t border-border-primary space-y-3">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Calculate from Grant
                  </p>
                  
                  <NumberInput
                    label="Total Shares in Grant"
                    value={totalShares}
                    onChange={setTotalShares}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Vesting Schedule (%)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <PercentInput
                          key={index}
                          label={`Y${index + 1}`}
                          value={vestingPercents[index]}
                          onChange={(val) => updateVestingPercent(index, val)}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${vestingValid ? 'text-zone-go' : 'text-zone-stop'}`}>
                      Total: {vestingTotal}% {vestingValid ? '✓' : '— must equal 100%'}
                    </p>
                  </div>
                  
                  <button
                    onClick={applyVestingCalculation}
                    disabled={!vestingValid || totalShares === null}
                    className={`
                      w-full py-2.5 px-4 rounded-md text-sm font-medium
                      ${vestingValid && totalShares !== null
                        ? 'bg-accent text-text-primary hover:bg-accent/90'
                        : 'bg-btn-disabled text-text-secondary cursor-not-allowed opacity-40'
                      }
                    `}
                  >
                    Apply to shares per year
                  </button>
                </div>
              </div>
            </div>
            
            {/* Optional: Annual Bonus */}
            <Collapsible title="Annual Bonus (optional)">
              <div className="flex items-center gap-4">
                <PercentInput
                  label="Target %"
                  value={bonusPercent}
                  onChange={setBonusPercent}
                  className="flex-1"
                />
                {baseSalary && bonusPercent ? (
                  <div className="text-sm text-text-secondary pt-6">
                    = ${Math.round(baseSalary * (bonusPercent / 100)).toLocaleString()}/year
                  </div>
                ) : null}
              </div>
            </Collapsible>
            
            {/* Optional: Sign-On */}
            <Collapsible title="Sign-On Bonus (optional)">
              <div className="grid grid-cols-2 gap-2">
                {calendarYears.map((year, index) => (
                  <CurrencyInput
                    key={year}
                    label={year.toString()}
                    value={signOnPerYear[index]}
                    onChange={(val) => updateSignOnYear(index, val)}
                  />
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-2">Blank = $0</p>
            </Collapsible>
          </div>
          
          {/* ================ */}
          {/* LOCAL ALTERNATIVE */}
          {/* ================ */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Local Alternative</h3>
            
            <CurrencyInput
              label="Annual TC"
              value={localAlt}
              onChange={setLocalAlt}
              helpText="Best available TC in the local market"
            />
            
            <button
              onClick={() => {
                if (!localDifferentPerYear && localAlt !== null) {
                  setLocalPerYear(Array(4).fill(localAlt))
                }
                setLocalDifferentPerYear(!localDifferentPerYear)
              }}
              className="text-sm text-text-secondary hover:text-accent"
            >
              {localDifferentPerYear ? '▼' : '▶'} Different per year
            </button>
            
            {localDifferentPerYear && (
              <div className="grid grid-cols-2 gap-2">
                {calendarYears.map((year, index) => (
                  <CurrencyInput
                    key={year}
                    label={year.toString()}
                    value={localPerYear[index]}
                    onChange={(val) => updateLocalYear(index, val)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* ============== */}
          {/* TRAVEL EXPENSE */}
          {/* ============== */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Travel Expense</h3>
            
            <CurrencyInput
              label="Annual Expense"
              value={baseTravel}
              onChange={setBaseTravel}
              helpText="Flights + housing + ground transportation"
            />
            
            <PercentInput
              label="Annual Inflation"
              value={inflationRate}
              onChange={setInflationRate}
            />
            
            <button
              onClick={() => {
                if (!travelDifferentPerYear && baseTravel !== null) {
                  setTravelPerYear(calculatedTravelPerYear.map(t => t || null) as (number | null)[])
                }
                setTravelDifferentPerYear(!travelDifferentPerYear)
              }}
              className="text-sm text-text-secondary hover:text-accent"
            >
              {travelDifferentPerYear ? '▼' : '▶'} Override per year
            </button>
            
            {travelDifferentPerYear && (
              <div className="grid grid-cols-2 gap-2">
                {calendarYears.map((year, index) => (
                  <CurrencyInput
                    key={year}
                    label={year.toString()}
                    value={travelPerYear[index]}
                    onChange={(val) => updateTravelYear(index, val)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* ============== */}
          {/* TAX ADJUSTMENT */}
          {/* ============== */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Tax Adjustment (optional)</h3>
            
            <CurrencyInput
              label="Annual Amount"
              value={taxAmount}
              onChange={setTaxAmount}
              helpText="Positive = corridor has higher taxes"
            />
            
            <button
              onClick={() => {
                if (!taxDifferentPerYear && taxAmount !== null) {
                  setTaxPerYear(Array(4).fill(taxAmount))
                }
                setTaxDifferentPerYear(!taxDifferentPerYear)
              }}
              className="text-sm text-text-secondary hover:text-accent"
            >
              {taxDifferentPerYear ? '▼' : '▶'} Different per year
            </button>
            
            {taxDifferentPerYear && (
              <div className="grid grid-cols-2 gap-2">
                {calendarYears.map((year, index) => (
                  <CurrencyInput
                    key={year}
                    label={year.toString()}
                    value={taxPerYear[index]}
                    onChange={(val) => updateTaxYear(index, val)}
                  />
                ))}
              </div>
            )}
            
            <p className="text-xs text-text-secondary">
              This is not tax advice. Consult a qualified tax professional.
            </p>
          </div>
          
          {/* ============ */}
          {/* FLIGHT HOURS */}
          {/* ============ */}
          <div className="p-4 bg-bg-card border border-border-primary rounded-lg">
            <NumberInput
              label="Flight Hours"
              value={flightHours}
              onChange={setFlightHours}
              helpText="Total hours in the air per year (for Sky Rate)"
            />
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
