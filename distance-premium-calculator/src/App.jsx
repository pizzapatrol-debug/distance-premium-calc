import React, { useState, useMemo } from 'react';

// Color palette from Visual Identity
const colors = {
  greyTeal: '#5D7A7A',
  terracotta: '#C67D5A',
  warmWhite: '#FAF8F5',
  softBlack: '#2A2A2A',
  midGrey: '#8A8A8A',
};

const zones = {
  STRONG: { label: 'Strong', color: colors.greyTeal, min: 1.30 },
  GO: { label: 'Go', color: '#7A9A7A', min: 1.15 },
  CAUTION: { label: 'Caution', color: '#C6A85A', min: 1.00 },
  STOP: { label: 'Stop', color: colors.terracotta, min: 0 },
};

function getZone(ratio) {
  if (ratio >= 1.30) return zones.STRONG;
  if (ratio >= 1.15) return zones.GO;
  if (ratio >= 1.00) return zones.CAUTION;
  return zones.STOP;
}

function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatRatio(num) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return num.toFixed(2) + 'x';
}

function InputField({ label, value, onChange, placeholder, help }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        color: colors.softBlack,
        marginBottom: '4px',
        fontWeight: 500,
      }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: `1px solid ${colors.midGrey}`,
          borderRadius: '4px',
          backgroundColor: 'white',
          color: colors.softBlack,
          boxSizing: 'border-box',
        }}
      />
      {help && (
        <p style={{ 
          fontSize: '12px', 
          color: colors.midGrey, 
          marginTop: '4px',
          marginBottom: 0,
          lineHeight: 1.4,
        }}>
          {help}
        </p>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtext, highlight }) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'white',
      border: `1px solid ${highlight ? colors.greyTeal : '#e0e0e0'}`,
      borderRadius: '4px',
      marginBottom: '12px',
    }}>
      <div style={{ 
        fontSize: '12px', 
        color: colors.midGrey,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 500,
        color: colors.softBlack,
        fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
      }}>
        {value}
      </div>
      {subtext && (
        <div style={{ 
          fontSize: '12px', 
          color: colors.midGrey,
          marginTop: '4px',
        }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

function ZoneIndicator({ ratio, zone }) {
  // Calculate position (0.80 to 1.50 range)
  const minVal = 0.80;
  const maxVal = 1.50;
  const clampedRatio = Math.min(Math.max(ratio, minVal), maxVal);
  const position = ((clampedRatio - minVal) / (maxVal - minVal)) * 100;
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: colors.softBlack,
          fontWeight: 500,
        }}>
          Go/No-Go Ratio
        </span>
        <span style={{
          fontSize: '20px',
          fontWeight: 500,
          color: zone.color,
          fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
        }}>
          {formatRatio(ratio)} — {zone.label}
        </span>
      </div>
      
      {/* Zone bar */}
      <div style={{
        position: 'relative',
        height: '24px',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{ flex: '20%', backgroundColor: colors.terracotta, opacity: 0.7 }} />
        <div style={{ flex: '15%', backgroundColor: '#C6A85A', opacity: 0.7 }} />
        <div style={{ flex: '15%', backgroundColor: '#7A9A7A', opacity: 0.7 }} />
        <div style={{ flex: '50%', backgroundColor: colors.greyTeal, opacity: 0.7 }} />
        
        {/* Current position marker */}
        {ratio > 0 && (
          <div style={{
            position: 'absolute',
            left: `${position}%`,
            top: '-4px',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `10px solid ${colors.softBlack}`,
          }} />
        )}
      </div>
      
      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
        fontSize: '11px',
        color: colors.midGrey,
      }}>
        <span>Stop</span>
        <span>Caution</span>
        <span>Go</span>
        <span>Strong</span>
      </div>
    </div>
  );
}

function BreakingPoints({ hubTC, localAlt, travelExp, salaryGap }) {
  const hubFloor = localAlt + travelExp;
  const localCeiling = hubTC - travelExp;
  const travelCeiling = salaryGap;
  
  const hubBuffer = hubTC - hubFloor;
  const localBuffer = localCeiling - localAlt;
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'white',
      border: `1px solid #e0e0e0`,
      borderRadius: '4px',
      marginTop: '24px',
    }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 500,
        color: colors.softBlack,
        marginBottom: '12px',
      }}>
        Breaking Points
      </div>
      
      <div style={{ fontSize: '13px', lineHeight: 1.8, color: colors.softBlack }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>Hub compensation floor:</span>
          <span style={{ fontFamily: '"SF Mono", SFMono-Regular, Consolas, monospace' }}>
            {formatCurrency(hubFloor)}
          </span>
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: colors.midGrey, 
          marginBottom: '8px',
          textAlign: 'right',
        }}>
          {hubBuffer > 0 ? `${formatCurrency(hubBuffer)} buffer` : 'At or below floor'}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>Local alternative ceiling:</span>
          <span style={{ fontFamily: '"SF Mono", SFMono-Regular, Consolas, monospace' }}>
            {formatCurrency(localCeiling)}
          </span>
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: colors.midGrey, 
          marginBottom: '8px',
          textAlign: 'right',
        }}>
          {localBuffer > 0 ? `${formatCurrency(localBuffer)} buffer` : 'At or above ceiling'}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>Travel expense ceiling:</span>
          <span style={{ fontFamily: '"SF Mono", SFMono-Regular, Consolas, monospace' }}>
            {formatCurrency(travelCeiling)}
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Inputs
  const [hubTC, setHubTC] = useState('');
  const [localAlt, setLocalAlt] = useState('');
  const [flights, setFlights] = useState('');
  const [housing, setHousing] = useState('');
  const [ground, setGround] = useState('');
  const [flightHours, setFlightHours] = useState('');
  
  // Calculations
  const calculations = useMemo(() => {
    const hub = Number(hubTC) || 0;
    const local = Number(localAlt) || 0;
    const travelExp = (Number(flights) || 0) + (Number(housing) || 0) + (Number(ground) || 0);
    const hours = Number(flightHours) || 0;
    
    if (hub === 0 || local === 0) {
      return null;
    }
    
    const salaryGap = hub - local;
    const distancePremium = salaryGap - travelExp;
    const skyRate = hours > 0 ? distancePremium / hours : 0;
    const hubNet = hub - travelExp;
    const goNoGo = hubNet / local;
    const zone = getZone(goNoGo);
    
    return {
      salaryGap,
      travelExp,
      distancePremium,
      skyRate,
      hubNet,
      goNoGo,
      zone,
    };
  }, [hubTC, localAlt, flights, housing, ground, flightHours]);
  
  const hasInputs = hubTC !== '' && localAlt !== '';
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.warmWhite,
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 500,
            color: colors.softBlack,
            margin: '0 0 8px 0',
          }}>
            Distance Premium Calculator
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: colors.midGrey,
            margin: 0,
            lineHeight: 1.5,
          }}>
            All calculations happen in your browser. No data is stored or transmitted.
          </p>
        </div>
        
        {/* Inputs Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 500,
            color: colors.greyTeal,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
          }}>
            Compensation
          </h2>
          
          <InputField
            label="Hub Total Compensation"
            value={hubTC}
            onChange={setHubTC}
            placeholder="450000"
            help="Annual TC at hub city job (base + bonus + equity value)"
          />
          
          <InputField
            label="Local Alternative"
            value={localAlt}
            onChange={setLocalAlt}
            placeholder="300000"
            help="Best available TC for local job in family's city"
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 500,
            color: colors.greyTeal,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
          }}>
            Travel Expense
          </h2>
          
          <InputField
            label="Annual Flights"
            value={flights}
            onChange={setFlights}
            placeholder="16000"
            help="Total airfare per year"
          />
          
          <InputField
            label="Annual Housing"
            value={housing}
            onChange={setHousing}
            placeholder="21000"
            help="Rent, utilities at work city"
          />
          
          <InputField
            label="Annual Ground Transportation"
            value={ground}
            onChange={setGround}
            placeholder="7000"
            help="Rideshare, parking, rental car, etc."
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 500,
            color: colors.greyTeal,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
          }}>
            Time
          </h2>
          
          <InputField
            label="Annual Flight Hours"
            value={flightHours}
            onChange={setFlightHours}
            placeholder="262"
            help="Total hours in the air per year (flights × avg duration)"
          />
        </div>
        
        {/* Results Section */}
        {hasInputs && calculations && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '14px', 
              fontWeight: 500,
              color: colors.greyTeal,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
            }}>
              Results
            </h2>
            
            <ZoneIndicator ratio={calculations.goNoGo} zone={calculations.zone} />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px',
            }}>
              <MetricCard
                label="Escape Penalty"
                value={formatCurrency(calculations.salaryGap)}
                subtext="What the trap charges"
              />
              <MetricCard
                label="Travel Expense"
                value={formatCurrency(calculations.travelExp)}
                subtext="What the corridor costs"
              />
              <MetricCard
                label="Distance Premium"
                value={formatCurrency(calculations.distancePremium)}
                subtext="What you capture"
                highlight={calculations.distancePremium > 0}
              />
              <MetricCard
                label="Sky Rate"
                value={calculations.skyRate > 0 ? `$${Math.round(calculations.skyRate)}/hr` : '—'}
                subtext="Hourly rate for flight time"
              />
            </div>
            
            <BreakingPoints
              hubTC={Number(hubTC) || 0}
              localAlt={Number(localAlt) || 0}
              travelExp={calculations.travelExp}
              salaryGap={calculations.salaryGap}
            />
          </div>
        )}
        
        {/* Thresholds Reference */}
        <div style={{
          padding: '16px',
          backgroundColor: 'white',
          border: `1px solid #e0e0e0`,
          borderRadius: '4px',
          marginBottom: '24px',
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 500,
            color: colors.softBlack,
            marginBottom: '12px',
          }}>
            Thresholds
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.8, color: colors.midGrey }}>
            <div><span style={{ color: colors.greyTeal }}>■</span> Above 1.30x — Strong</div>
            <div><span style={{ color: '#7A9A7A' }}>■</span> 1.15x to 1.30x — Go</div>
            <div><span style={{ color: '#C6A85A' }}>■</span> 1.00x to 1.15x — Caution</div>
            <div><span style={{ color: colors.terracotta }}>■</span> Below 1.00x — Stop</div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div style={{
          fontSize: '12px',
          color: colors.midGrey,
          lineHeight: 1.6,
          borderTop: `1px solid #e0e0e0`,
          paddingTop: '16px',
        }}>
          <p style={{ margin: '0 0 12px 0' }}>
            The math is necessary. It's not sufficient.
          </p>
          <p style={{ margin: 0 }}>
            This calculator shows whether the financial case exists. It does not capture 
            what the arrangement costs in ways no spreadsheet can see: the moments missed, 
            the weight carried, the questions that don't have ratios. All figures are pre-tax. 
            Consult qualified professionals for decisions affecting your employment, taxes, 
            or family situation.
          </p>
        </div>
        
        {/* Footer link */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid #e0e0e0`,
          textAlign: 'center',
        }}>
          <a 
            href="https://1100mileworkday.com" 
            style={{ 
              color: colors.greyTeal, 
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            1100 Mile Workday
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
