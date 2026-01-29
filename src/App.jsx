import React, { useState, useMemo } from 'react';

// Color palette from Visual Identity - Dark Mode Primary
const colors = {
  greyTeal: '#5D7A7A',
  greyTealLight: '#7A9999',
  terracotta: '#C67D5A',
  terracottaLight: '#D4967A',
  warmWhite: '#FAF8F5',
  softBlack: '#1A1A1A',
  darkGrey: '#252525',
  cardBg: '#2A2A2A',
  midGrey: '#6A6A6A',
  textPrimary: '#E8E6E3',
  textSecondary: '#9A9A9A',
  border: '#3A3A3A',
};

const zones = {
  STRONG: { label: 'Strong', color: colors.greyTealLight, bg: 'rgba(93, 122, 122, 0.15)' },
  GO: { label: 'Go', color: '#8AAA8A', bg: 'rgba(138, 170, 138, 0.15)' },
  CAUTION: { label: 'Caution', color: '#D4B86A', bg: 'rgba(212, 184, 106, 0.15)' },
  STOP: { label: 'Stop', color: colors.terracottaLight, bg: 'rgba(198, 125, 90, 0.15)' },
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

function InputField({ label, value, onChange, placeholder, help, prefix = '$' }) {
  const [focused, setFocused] = useState(false);
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '13px', 
        color: colors.textSecondary,
        marginBottom: '6px',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        {label}
      </label>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        {prefix && (
          <span style={{
            position: 'absolute',
            left: '14px',
            color: colors.textSecondary,
            fontSize: '16px',
            pointerEvents: 'none',
          }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: prefix ? '14px 14px 14px 28px' : '14px',
            fontSize: '16px',
            border: `1px solid ${focused ? colors.greyTeal : colors.border}`,
            borderRadius: '8px',
            backgroundColor: colors.darkGrey,
            color: colors.textPrimary,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: focused ? `0 0 0 3px rgba(93, 122, 122, 0.2)` : 'none',
          }}
        />
      </div>
      {help && (
        <p style={{ 
          fontSize: '12px', 
          color: colors.midGrey, 
          marginTop: '6px',
          marginBottom: 0,
          lineHeight: 1.4,
        }}>
          {help}
        </p>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtext, highlight, large }) {
  return (
    <div style={{
      padding: large ? '20px' : '16px',
      backgroundColor: highlight ? zones.STRONG.bg : colors.cardBg,
      border: `1px solid ${highlight ? colors.greyTeal : colors.border}`,
      borderRadius: '10px',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ 
        fontSize: '11px', 
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '6px',
        fontWeight: 500,
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: large ? '28px' : '22px', 
        fontWeight: 600,
        color: highlight ? colors.greyTealLight : colors.textPrimary,
        fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {subtext && (
        <div style={{ 
          fontSize: '12px', 
          color: colors.textSecondary,
          marginTop: '4px',
        }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

function ZoneIndicator({ ratio, zone }) {
  const minVal = 0.80;
  const maxVal = 1.50;
  const clampedRatio = Math.min(Math.max(ratio, minVal), maxVal);
  const position = ((clampedRatio - minVal) / (maxVal - minVal)) * 100;
  
  return (
    <div style={{ 
      marginBottom: '28px',
      padding: '20px',
      backgroundColor: zone.bg,
      borderRadius: '12px',
      border: `1px solid ${zone.color}40`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ 
          fontSize: '13px', 
          color: colors.textSecondary,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Go/No-Go
        </span>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontSize: '32px',
            fontWeight: 600,
            color: zone.color,
            fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            letterSpacing: '-0.02em',
          }}>
            {formatRatio(ratio)}
          </span>
          <span style={{
            display: 'block',
            fontSize: '14px',
            color: zone.color,
            fontWeight: 500,
            marginTop: '2px',
          }}>
            {zone.label}
          </span>
        </div>
      </div>
      
      {/* Zone bar */}
      <div style={{
        position: 'relative',
        height: '8px',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        backgroundColor: colors.darkGrey,
      }}>
        <div style={{ flex: '20%', backgroundColor: colors.terracotta, opacity: 0.6 }} />
        <div style={{ flex: '15%', backgroundColor: '#D4B86A', opacity: 0.6 }} />
        <div style={{ flex: '15%', backgroundColor: '#8AAA8A', opacity: 0.6 }} />
        <div style={{ flex: '50%', backgroundColor: colors.greyTeal, opacity: 0.6 }} />
        
        {/* Current position marker */}
        {ratio > 0 && (
          <div style={{
            position: 'absolute',
            left: `${position}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            backgroundColor: zone.color,
            borderRadius: '50%',
            border: `3px solid ${colors.softBlack}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }} />
        )}
      </div>
      
      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '10px',
        color: colors.midGrey,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
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
  
  const points = [
    { 
      label: 'Hub compensation floor', 
      value: hubFloor, 
      buffer: hubBuffer,
      bufferLabel: hubBuffer > 0 ? `${formatCurrency(hubBuffer)} buffer` : 'At or below floor',
      ok: hubBuffer > 0,
    },
    { 
      label: 'Local alternative ceiling', 
      value: localCeiling, 
      buffer: localBuffer,
      bufferLabel: localBuffer > 0 ? `${formatCurrency(localBuffer)} buffer` : 'At or above ceiling',
      ok: localBuffer > 0,
    },
    { 
      label: 'Travel expense ceiling', 
      value: travelCeiling, 
      buffer: travelCeiling - travelExp,
      bufferLabel: `${formatCurrency(travelCeiling - travelExp)} buffer`,
      ok: travelCeiling > travelExp,
    },
  ];
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      marginTop: '20px',
    }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 500,
        color: colors.textSecondary,
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Breaking Points
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {points.map((point, i) => (
          <div key={i}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>
                {point.label}
              </span>
              <span style={{ 
                fontFamily: '"SF Mono", SFMono-Regular, Consolas, monospace',
                fontSize: '14px',
                color: colors.textPrimary,
                fontWeight: 500,
              }}>
                {formatCurrency(point.value)}
              </span>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: point.ok ? colors.greyTealLight : colors.terracottaLight, 
              marginTop: '2px',
              textAlign: 'right',
            }}>
              {point.bufferLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <h2 style={{ 
      fontSize: '11px', 
      fontWeight: 600,
      color: colors.greyTealLight,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
    }}>
      {children}
    </h2>
  );
}

function App() {
  const [hubTC, setHubTC] = useState('');
  const [localAlt, setLocalAlt] = useState('');
  const [flights, setFlights] = useState('');
  const [housing, setHousing] = useState('');
  const [ground, setGround] = useState('');
  const [flightHours, setFlightHours] = useState('');
  
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
      backgroundColor: colors.softBlack,
      padding: '32px 16px',
    }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 600,
            color: colors.textPrimary,
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}>
            Distance Premium Calculator
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: colors.midGrey,
            margin: 0,
            lineHeight: 1.5,
          }}>
            All calculations happen in your browser. No data is stored or transmitted.
          </p>
        </div>
        
        {/* Inputs */}
        <div style={{ marginBottom: '32px' }}>
          <SectionHeader>Compensation</SectionHeader>
          
          <InputField
            label="Hub Total Compensation"
            value={hubTC}
            onChange={setHubTC}
            placeholder="450,000"
            help="Annual TC at hub city (base + bonus + equity)"
          />
          
          <InputField
            label="Local Alternative"
            value={localAlt}
            onChange={setLocalAlt}
            placeholder="300,000"
            help="Best available TC for local job"
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <SectionHeader>Travel Expense</SectionHeader>
          
          <InputField
            label="Annual Flights"
            value={flights}
            onChange={setFlights}
            placeholder="16,000"
            help="Total airfare per year"
          />
          
          <InputField
            label="Annual Housing"
            value={housing}
            onChange={setHousing}
            placeholder="21,000"
            help="Rent and utilities at work city"
          />
          
          <InputField
            label="Annual Ground Transportation"
            value={ground}
            onChange={setGround}
            placeholder="7,000"
            help="Rideshare, parking, car costs"
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <SectionHeader>Time</SectionHeader>
          
          <InputField
            label="Annual Flight Hours"
            value={flightHours}
            onChange={setFlightHours}
            placeholder="262"
            prefix=""
            help="Total hours in the air (flights × avg duration)"
          />
        </div>
        
        {/* Results */}
        {hasInputs && calculations && (
          <div style={{ marginBottom: '32px' }}>
            <SectionHeader>Results</SectionHeader>
            
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
                subtext="Per hour in the air"
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
        
        {/* Thresholds */}
        <div style={{
          padding: '20px',
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Thresholds
          </div>
          <div style={{ 
            fontSize: '13px', 
            lineHeight: 2, 
            color: colors.textSecondary,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '4px 16px',
          }}>
            <div><span style={{ color: colors.greyTealLight }}>●</span> Above 1.30x — Strong</div>
            <div><span style={{ color: '#8AAA8A' }}>●</span> 1.15x – 1.30x — Go</div>
            <div><span style={{ color: '#D4B86A' }}>●</span> 1.00x – 1.15x — Caution</div>
            <div><span style={{ color: colors.terracottaLight }}>●</span> Below 1.00x — Stop</div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div style={{
          fontSize: '12px',
          color: colors.midGrey,
          lineHeight: 1.7,
          borderTop: `1px solid ${colors.border}`,
          paddingTop: '20px',
        }}>
          <p style={{ 
            margin: '0 0 12px 0',
            color: colors.textSecondary,
            fontStyle: 'italic',
          }}>
            The math is necessary. It's not sufficient.
          </p>
          <p style={{ margin: 0 }}>
            This calculator shows whether the financial case exists. It does not capture 
            what the arrangement costs in ways no spreadsheet can see. All figures are pre-tax. 
            Consult qualified professionals for your specific situation.
          </p>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'center',
        }}>
          <a 
            href="https://1100mileworkday.com" 
            style={{ 
              color: colors.greyTeal, 
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseOver={(e) => e.target.style.color = colors.greyTealLight}
            onMouseOut={(e) => e.target.style.color = colors.greyTeal}
          >
            1100 Mile Workday
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
