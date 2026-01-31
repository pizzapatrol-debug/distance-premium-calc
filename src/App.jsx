import { useState, useEffect, useCallback } from 'react'

// ============================================
// CONSTANTS
// ============================================

const ZONE_COLORS = {
  strong: '#5D7A8A',
  go: '#7A9E7A',
  caution: '#C4A055',
  stop: '#B87070'
}

const ZONE_DESCRIPTIONS = {
  strong: 'Financial comparison shows significant margin',
  go: 'Financial comparison shows positive margin',
  caution: 'Financial comparison shows narrow margin',
  stop: 'Financial comparison shows no margin or negative'
}

const ZONE_THRESHOLDS = {
  strong: 1.30,
  go: 1.15,
  caution: 1.00
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  if (isNaN(num)) return ''
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const parseCurrency = (value) => {
  if (!value) return 0
  const num = parseFloat(value.replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? 0 : num
}

const formatRatio = (ratio) => {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return '—'
  return `${ratio.toFixed(2)}x`
}

const getZone = (ratio) => {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return null
  if (ratio >= ZONE_THRESHOLDS.strong) return 'strong'
  if (ratio >= ZONE_THRESHOLDS.go) return 'go'
  if (ratio >= ZONE_THRESHOLDS.caution) return 'caution'
  return 'stop'
}

const getZoneColor = (zone) => {
  return ZONE_COLORS[zone] || '#9A9A9A'
}

const getMarkerPosition = (ratio) => {
  // Range: 0.80 to 1.50
  if (ratio === null || ratio === undefined || isNaN(ratio)) return 50
  const clamped = Math.max(0.80, Math.min(1.50, ratio))
  return ((clamped - 0.80) / 0.70) * 100
}

// ============================================
// CONSENT GATE COMPONENT
// ============================================

function ConsentGate({ onConsent }) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="consent-gate">
      <h1 className="consent-gate__title">Distance Premium Calculator — Basic</h1>
      
      <div className="consent-gate__divider" />
      
      <h2 className="consent-gate__section-title">Before You Begin</h2>
      
      <p className="consent-gate__intro">
        This calculator provides estimates for informational purposes only. 
        It does not constitute financial, tax, legal, or career advice.
      </p>
      
      <ul className="consent-gate__bullets">
        <li>Results are based on inputs you provide</li>
        <li>Tax estimates are simplified and may not reflect your actual liability</li>
        <li>Consult qualified professionals before making decisions</li>
      </ul>
      
      <div className="consent-gate__checkbox-container">
        <label className="consent-gate__checkbox-label">
          <input
            type="checkbox"
            className="consent-gate__checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            I understand this calculator provides estimates only and is not 
            a recommendation to take any action.
          </span>
        </label>
      </div>
      
      <button
        className="consent-gate__button"
        disabled={!checked}
        onClick={onConsent}
        aria-disabled={!checked}
      >
        Continue to Calculator
      </button>
      
      <div className="consent-gate__footer">
        <a 
          href="https://substack.com/@1100mileworkday" 
          target="_blank" 
          rel="noopener noreferrer"
          className="consent-gate__brand"
        >
          <div className="consent-gate__logo">1100</div>
          <span>1100 Mile Workday</span>
        </a>
      </div>
    </div>
  )
}

// ============================================
// ARC BAR COMPONENT
// ============================================

function ArcBar({ ratio, zone }) {
  const isEmpty = ratio === null || ratio === undefined || isNaN(ratio)
  const markerPosition = getMarkerPosition(ratio)
  const zoneColor = getZoneColor(zone)
  const zoneName = zone ? zone.charAt(0).toUpperCase() + zone.slice(1) : ''
  const zoneDescription = zone ? ZONE_DESCRIPTIONS[zone] : ''

  return (
    <div className={`arc-bar-container ${isEmpty ? 'arc-bar--empty' : ''}`}>
      <div 
        className="arc-bar__ratio"
        style={{ color: isEmpty ? undefined : zoneColor }}
      >
        {isEmpty ? '—' : formatRatio(ratio)} {!isEmpty && `— ${zoneName}`}
      </div>
      
      <div className="arc-bar__track">
        <div className="arc-bar__segments">
          <div className="arc-bar__segment arc-bar__segment--stop" />
          <div className="arc-bar__segment arc-bar__segment--caution" />
          <div className="arc-bar__segment arc-bar__segment--go" />
          <div className="arc-bar__segment arc-bar__segment--strong" />
        </div>
        {!isEmpty && (
          <div 
            className="arc-bar__marker"
            style={{ left: `${markerPosition}%` }}
          />
        )}
      </div>
      
      <div className="arc-bar__labels">
        <span className="arc-bar__label">Stop</span>
        <span className="arc-bar__label">Caution</span>
        <span className="arc-bar__label">Go</span>
        <span className="arc-bar__label">Strong</span>
      </div>
      
      {!isEmpty && zoneDescription && (
        <div className="arc-bar__description">
          {zoneDescription}
        </div>
      )}
    </div>
  )
}

// ============================================
// METRIC CARD COMPONENT
// ============================================

function MetricCard({ label, value, subtext, tooltip }) {
  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {tooltip && (
          <span className="metric-card__info" tabIndex={0} role="button" aria-label={tooltip}>
            i
            <span className="metric-card__tooltip">{tooltip}</span>
          </span>
        )}
      </div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__subtext">{subtext}</div>
    </div>
  )
}

// ============================================
// METRICS GRID COMPONENT
// ============================================

function MetricsGrid({ escapePenalty, travelExpense, distancePremium, skyRate }) {
  return (
    <div className="metrics-grid">
      <MetricCard
        label="Escape Penalty"
        value={`$${formatCurrency(escapePenalty)}`}
        subtext="What the trap charges"
        tooltip="The minimum cost to leave the trap through conventional means"
      />
      <MetricCard
        label="Travel Expense"
        value={`$${formatCurrency(travelExpense)}`}
        subtext="What the corridor costs"
        tooltip="Total annual cost of flights, housing, and ground transportation"
      />
      <MetricCard
        label="Distance Premium"
        value={`$${formatCurrency(distancePremium)}`}
        subtext="What you capture"
        tooltip="Annual wealth built by traveling instead of escaping"
      />
      <MetricCard
        label="Sky Rate"
        value={skyRate !== null ? `$${formatCurrency(skyRate)}/hr` : '—'}
        subtext="Per hour in the air"
        tooltip="Effective hourly rate for time spent flying"
      />
    </div>
  )
}

// ============================================
// BREAKING POINTS COMPONENT
// ============================================

function BreakingPoints({ corridorFloor, localCeiling, travelCeiling, currentCorridor, currentLocal, currentTravel, salaryGap }) {
  const corridorBuffer = currentCorridor - corridorFloor
  const localBuffer = localCeiling - currentLocal
  const travelBuffer = travelCeiling - currentTravel

  const corridorPercent = Math.min(100, Math.max(0, (corridorFloor / currentCorridor) * 100))
  const localPercent = Math.min(100, Math.max(0, (currentLocal / localCeiling) * 100))
  const travelPercent = salaryGap > 0 ? Math.min(100, Math.max(0, (currentTravel / salaryGap) * 100)) : 0

  return (
    <div className="breaking-points">
      <h3 className="breaking-points__title">Breaking Points</h3>
      
      <div className="breaking-point">
        <div className="breaking-point__header">
          <span className="breaking-point__label">Corridor Floor</span>
          <span className="breaking-point__value">${formatCurrency(corridorFloor)}</span>
        </div>
        <div className="breaking-point__bar">
          <div 
            className="breaking-point__fill" 
            style={{ width: `${corridorPercent}%` }}
          />
        </div>
        <div className="breaking-point__buffer">
          ${formatCurrency(corridorBuffer)} buffer
        </div>
      </div>
      
      <div className="breaking-point">
        <div className="breaking-point__header">
          <span className="breaking-point__label">Local Ceiling</span>
          <span className="breaking-point__value">${formatCurrency(localCeiling)}</span>
        </div>
        <div className="breaking-point__bar">
          <div 
            className="breaking-point__fill" 
            style={{ width: `${localPercent}%` }}
          />
        </div>
        <div className="breaking-point__buffer">
          ${formatCurrency(localBuffer)} buffer
        </div>
      </div>
      
      <div className="breaking-point">
        <div className="breaking-point__header">
          <span className="breaking-point__label">Travel Ceiling</span>
          <span className="breaking-point__value">${formatCurrency(travelCeiling)}</span>
        </div>
        <div className="breaking-point__bar">
          <div 
            className="breaking-point__fill" 
            style={{ width: `${travelPercent}%` }}
          />
        </div>
        <div className="breaking-point__buffer">
          ${formatCurrency(travelBuffer)} buffer
        </div>
      </div>
    </div>
  )
}

// ============================================
// ESCAPE COMPARISON COMPONENT
// ============================================

function EscapeComparison({ salaryGap, relocationCost }) {
  const salaryGapWins = salaryGap <= relocationCost
  const maxValue = Math.max(salaryGap, relocationCost)
  const salaryGapWidth = maxValue > 0 ? (salaryGap / maxValue) * 100 : 50
  const relocationWidth = maxValue > 0 ? (relocationCost / maxValue) * 100 : 50

  return (
    <div className="escape-comparison">
      <h3 className="escape-comparison__title">Escape Route Comparison</h3>
      
      <div className="escape-comparison__options">
        <div className="escape-option">
          <div className="escape-option__label">Stay Local</div>
          <div 
            className="escape-option__bar" 
            style={{ width: `${salaryGapWidth}%`, margin: '0 auto' }}
          />
          <div className="escape-option__value">${formatCurrency(salaryGap)}/yr</div>
          <div className="escape-option__type">Salary Gap</div>
        </div>
        
        <div className="escape-option">
          <div className="escape-option__label">Relocate</div>
          <div 
            className="escape-option__bar" 
            style={{ width: `${relocationWidth}%`, margin: '0 auto' }}
          />
          <div className="escape-option__value">${formatCurrency(relocationCost)}/yr</div>
          <div className="escape-option__type">Relocation Cost</div>
        </div>
      </div>
      
      <div className="escape-comparison__winner">
        <span>✓</span> Lower cost exit: {salaryGapWins ? 'Stay Local' : 'Relocate'}
      </div>
    </div>
  )
}

// ============================================
// RESULTS DISCLAIMER COMPONENT
// ============================================

function ResultsDisclaimer() {
  return (
    <div className="results-disclaimer">
      <p className="results-disclaimer__text">
        This comparison is for informational purposes only. 
        The decision is yours alone.
      </p>
    </div>
  )
}

// ============================================
// INPUT FIELD COMPONENT
// ============================================

function InputField({ 
  label, 
  value, 
  onChange, 
  helpText, 
  warning,
  error,
  prefix = '$',
  inputMode = 'decimal',
  placeholder = ''
}) {
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    onChange(rawValue)
  }

  return (
    <div className="input-field">
      <label className="input-field__label">{label}</label>
      <div className="input-field__wrapper">
        {prefix && <span className="input-field__prefix">{prefix}</span>}
        <input
          type="text"
          inputMode={inputMode}
          className={`input-field__input ${!prefix ? 'input-field__input--no-prefix' : ''}`}
          value={formatCurrency(value)}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
      {helpText && !warning && !error && (
        <div className="input-field__help">{helpText}</div>
      )}
      {warning && <div className="input-field__warning">{warning}</div>}
      {error && <div className="input-field__error">{error}</div>}
    </div>
  )
}

// ============================================
// TOGGLE COMPONENT
// ============================================

function Toggle({ label, value, onChange, helpText, options }) {
  return (
    <div className="toggle-container">
      <span className="toggle-label">{label}</span>
      <div className="toggle-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            className={`toggle-button ${value === option.value ? 'toggle-button--active' : ''}`}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {helpText && <div className="toggle-help">{helpText}</div>}
    </div>
  )
}

// ============================================
// FOOTER COMPONENT
// ============================================

function Footer() {
  return (
    <footer className="footer">
      <a 
        href="https://substack.com/@1100mileworkday" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer__logo-link"
      >
        <div className="footer__logo">1100</div>
      </a>
      <p className="footer__disclaimer">
        These are not recommendations. The content in this calculator reflects 
        one person's experience and should not be construed as financial, tax, 
        legal, or career advice. Individual circumstances vary significantly. 
        Consult qualified professionals before making decisions affecting your 
        employment, taxes, or family situation. The creator is not a financial 
        advisor, attorney, or tax professional.
      </p>
    </footer>
  )
}

// ============================================
// CALCULATOR COMPONENT
// ============================================

function Calculator() {
  // Input state
  const [relocation, setRelocation] = useState('blocked')
  const [corridorComp, setCorridorComp] = useState('')
  const [localAlt, setLocalAlt] = useState('')
  const [relocationCost, setRelocationCost] = useState('')
  const [flights, setFlights] = useState('')
  const [housing, setHousing] = useState('')
  const [ground, setGround] = useState('')
  const [flightHours, setFlightHours] = useState('')

  // Calculated values
  const [calculations, setCalculations] = useState(null)

  // Calculate metrics whenever inputs change
  useEffect(() => {
    const corridor = parseCurrency(corridorComp)
    const local = parseCurrency(localAlt)
    const reloCost = parseCurrency(relocationCost)
    const flightsCost = parseCurrency(flights)
    const housingCost = parseCurrency(housing)
    const groundCost = parseCurrency(ground)
    const hours = parseFloat(flightHours) || 0

    // Need at least corridor and local to calculate
    if (corridor <= 0 || local <= 0) {
      setCalculations(null)
      return
    }

    const salaryGap = corridor - local
    const travelExpense = flightsCost + housingCost + groundCost

    // Escape Penalty
    let escapePenalty
    if (relocation === 'blocked') {
      escapePenalty = salaryGap
    } else {
      escapePenalty = Math.min(salaryGap, reloCost)
    }

    // Distance Premium
    const distancePremium = salaryGap - travelExpense

    // Sky Rate
    const skyRate = hours > 0 ? distancePremium / hours : null

    // Go/No-Go Ratio
    const goNoGo = (corridor - travelExpense) / local

    // Breaking Points
    const corridorFloor = local + travelExpense
    const localCeiling = corridor - travelExpense
    const travelCeiling = salaryGap

    // Zone
    const zone = getZone(goNoGo)

    // Warnings
    let warning = null
    if (salaryGap <= 0) {
      warning = 'noGap'
    } else if (travelExpense > 0 && distancePremium < 0) {
      warning = 'notViable'
    } else if (travelExpense === 0 && (corridor > 0 && local > 0)) {
      warning = 'addTravel'
    }

    setCalculations({
      salaryGap,
      travelExpense,
      escapePenalty,
      distancePremium,
      skyRate,
      goNoGo,
      zone,
      corridorFloor,
      localCeiling,
      travelCeiling,
      corridor,
      local,
      reloCost,
      warning
    })
  }, [relocation, corridorComp, localAlt, relocationCost, flights, housing, ground, flightHours])

  const hasResults = calculations !== null && calculations.warning !== 'noGap'
  const showEscapeComparison = relocation === 'available' && calculations && calculations.salaryGap > 0 && calculations.reloCost > 0

  return (
    <div className="calculator">
      {/* Header */}
      <header className="calculator__header">
        <h1 className="calculator__title">Distance Premium Calculator — Basic</h1>
        <p className="calculator__subtitle">
          All calculations happen in your browser. No data is stored or transmitted.
        </p>
      </header>

      {/* Arc Bar */}
      <ArcBar 
        ratio={hasResults ? calculations.goNoGo : null}
        zone={hasResults ? calculations.zone : null}
      />

      {/* Results Section */}
      <section className="results-section">
        <h2 className="results-section__title">Results</h2>
        
        {!hasResults ? (
          <div className="results-section__empty">
            {calculations?.warning === 'noGap' ? (
              'No salary gap exists. The local alternative pays equal or more.'
            ) : (
              'Enter values below to calculate.'
            )}
          </div>
        ) : (
          <div className="fade-in">
            {calculations.warning === 'addTravel' && (
              <div className="input-field__warning" style={{ marginBottom: '16px' }}>
                Add travel costs for accurate calculation
              </div>
            )}
            
            {calculations.warning === 'notViable' && (
              <div className="input-field__error" style={{ marginBottom: '16px' }}>
                Travel costs exceed the salary gap. The corridor is not viable.
              </div>
            )}

            <MetricsGrid
              escapePenalty={calculations.escapePenalty}
              travelExpense={calculations.travelExpense}
              distancePremium={calculations.distancePremium}
              skyRate={calculations.skyRate}
            />

            <BreakingPoints
              corridorFloor={calculations.corridorFloor}
              localCeiling={calculations.localCeiling}
              travelCeiling={calculations.travelCeiling}
              currentCorridor={calculations.corridor}
              currentLocal={calculations.local}
              currentTravel={calculations.travelExpense}
              salaryGap={calculations.salaryGap}
            />

            {showEscapeComparison && (
              <EscapeComparison
                salaryGap={calculations.salaryGap}
                relocationCost={calculations.reloCost}
              />
            )}

            <ResultsDisclaimer />
          </div>
        )}
      </section>

      {/* Inputs Section */}
      <section className="inputs-section">
        <h2 className="inputs-section__title">Inputs</h2>

        <Toggle
          label="Is relocation to the hub city blocked or available?"
          value={relocation}
          onChange={setRelocation}
          helpText="Custody, eldercare, spouse career, or mortgage lock can block relocation."
          options={[
            { value: 'blocked', label: 'Blocked' },
            { value: 'available', label: 'Available' }
          ]}
        />

        <div className="input-group">
          <h3 className="input-group__title">Compensation</h3>
          
          <InputField
            label="Corridor Compensation"
            value={corridorComp}
            onChange={setCorridorComp}
            helpText="Annual TC at hub city (base + bonus + equity), e.g., 450,000"
          />

          <InputField
            label="Local Alternative"
            value={localAlt}
            onChange={setLocalAlt}
            helpText="Best available TC in the local market, e.g., 300,000"
          />

          {relocation === 'available' && (
            <InputField
              label="Relocation Cost"
              value={relocationCost}
              onChange={setRelocationCost}
              helpText="Annual housing increase to relocate family to hub city, e.g., 60,000"
            />
          )}
        </div>

        <div className="input-group">
          <h3 className="input-group__title">Travel Expense</h3>
          
          <InputField
            label="Annual Flights"
            value={flights}
            onChange={setFlights}
            helpText="Total airfare per year, e.g., 16,000"
          />

          <InputField
            label="Annual Housing"
            value={housing}
            onChange={setHousing}
            helpText="Rent and utilities in hub city, e.g., 21,000"
          />

          <InputField
            label="Annual Ground Transportation"
            value={ground}
            onChange={setGround}
            helpText="Rideshare, parking, car costs, e.g., 7,000"
          />
        </div>

        <div className="input-group">
          <h3 className="input-group__title">Time</h3>
          
          <InputField
            label="Annual Flight Hours"
            value={flightHours}
            onChange={setFlightHours}
            prefix=""
            helpText="Total hours in the air per year, e.g., 260"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  const [hasConsented, setHasConsented] = useState(false)

  // Check session storage for existing consent
  useEffect(() => {
    const consent = sessionStorage.getItem('dpc_consent')
    if (consent === 'true') {
      setHasConsented(true)
    }
  }, [])

  const handleConsent = () => {
    sessionStorage.setItem('dpc_consent', 'true')
    setHasConsented(true)
  }

  return (
    <div className="app-container">
      {!hasConsented ? (
        <ConsentGate onConsent={handleConsent} />
      ) : (
        <Calculator />
      )}
    </div>
  )
}

export default App
