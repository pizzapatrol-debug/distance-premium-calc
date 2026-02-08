import { useEffect, useRef, useState } from 'react'
import { Zone, ZONE_COLORS, ZONE_DESCRIPTIONS } from '../../engine'

interface ArcGaugeProps {
  ratio: number | null
  zone: Zone | null
  isEmpty?: boolean
}

// Arc bar range: 0.80x to 1.50x
const MIN_RATIO = 0.80
const MAX_RATIO = 1.50

// Zone boundaries as percentages of the arc
const ZONE_BOUNDARIES = {
  stop: { start: 0, end: (1.00 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO) },
  caution: { start: (1.00 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO), end: (1.15 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO) },
  go: { start: (1.15 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO), end: (1.30 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO) },
  strong: { start: (1.30 - MIN_RATIO) / (MAX_RATIO - MIN_RATIO), end: 1 },
}

export function ArcGauge({ ratio, zone, isEmpty = false }: ArcGaugeProps) {
  const [position, setPosition] = useState(0)
  const [prevZone, setPrevZone] = useState<Zone | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  
  // Calculate position from ratio (0-100%)
  useEffect(() => {
    if (ratio === null) {
      setPosition(0)
      return
    }
    
    // Clamp ratio to display range
    const clampedRatio = Math.max(MIN_RATIO, Math.min(MAX_RATIO, ratio))
    const newPosition = ((clampedRatio - MIN_RATIO) / (MAX_RATIO - MIN_RATIO)) * 100
    setPosition(newPosition)
  }, [ratio])
  
  // Track zone changes for transition
  useEffect(() => {
    if (zone !== prevZone) {
      setIsTransitioning(true)
      const timer = setTimeout(() => setIsTransitioning(false), 200)
      setPrevZone(zone)
      return () => clearTimeout(timer)
    }
  }, [zone, prevZone])
  
  const formatRatio = (r: number) => `${r.toFixed(2)}x`
  
  const transitionClass = prefersReducedMotion.current 
    ? '' 
    : 'transition-all duration-250 ease-out'
  
  const fadeClass = prefersReducedMotion.current
    ? ''
    : 'transition-opacity duration-200 ease-in-out'
  
  return (
    <div 
      className="w-full py-4"
      role="meter"
      aria-valuenow={ratio ?? undefined}
      aria-valuemin={MIN_RATIO}
      aria-valuemax={MAX_RATIO}
      aria-label={zone ? `Go/No-Go ratio: ${formatRatio(ratio!)} ${zone}. ${ZONE_DESCRIPTIONS[zone]}` : 'Go/No-Go ratio'}
    >
      {/* Ratio and Zone Label */}
      <div className={`text-center mb-4 ${fadeClass} ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
        {isEmpty || ratio === null ? (
          <span className="font-mono text-3xl font-semibold text-text-secondary">—</span>
        ) : (
          <div className="flex items-baseline justify-center gap-2">
            <span 
              className="font-mono text-3xl font-semibold"
              style={{ color: zone ? ZONE_COLORS[zone] : undefined }}
            >
              {formatRatio(ratio)}
            </span>
            {zone && (
              <span 
                className="text-sm font-medium"
                style={{ color: ZONE_COLORS[zone] }}
              >
                {zone}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Arc Bar */}
      <div className="relative h-3 mx-auto max-w-md">
        {/* Background track with zones */}
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div 
            className="h-full"
            style={{ 
              width: `${ZONE_BOUNDARIES.stop.end * 100}%`,
              backgroundColor: isEmpty ? '#3A3A3A' : ZONE_COLORS.Stop,
              opacity: isEmpty ? 1 : 0.4
            }}
          />
          <div 
            className="h-full"
            style={{ 
              width: `${(ZONE_BOUNDARIES.caution.end - ZONE_BOUNDARIES.caution.start) * 100}%`,
              backgroundColor: isEmpty ? '#3A3A3A' : ZONE_COLORS.Caution,
              opacity: isEmpty ? 1 : 0.4
            }}
          />
          <div 
            className="h-full"
            style={{ 
              width: `${(ZONE_BOUNDARIES.go.end - ZONE_BOUNDARIES.go.start) * 100}%`,
              backgroundColor: isEmpty ? '#3A3A3A' : ZONE_COLORS.Go,
              opacity: isEmpty ? 1 : 0.4
            }}
          />
          <div 
            className="h-full flex-1"
            style={{ 
              backgroundColor: isEmpty ? '#3A3A3A' : ZONE_COLORS.Strong,
              opacity: isEmpty ? 1 : 0.4
            }}
          />
        </div>
        
        {/* Marker */}
        {!isEmpty && ratio !== null && zone && (
          <div 
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-bg-primary shadow-lg ${transitionClass}`}
            style={{ 
              left: `${position}%`,
              backgroundColor: ZONE_COLORS[zone],
            }}
          />
        )}
      </div>
      
      {/* Zone Labels */}
      <div className="flex justify-between mt-2 px-1 text-xxs text-text-secondary max-w-md mx-auto">
        <span>Stop</span>
        <span>Caution</span>
        <span>Go</span>
        <span>Strong</span>
      </div>
      
      {/* Zone Description */}
      <div className={`text-center mt-4 ${fadeClass} ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
        {zone ? (
          <p className="text-sm text-text-secondary">
            {ZONE_DESCRIPTIONS[zone]}
          </p>
        ) : (
          <p className="text-sm text-text-secondary opacity-0">—</p>
        )}
      </div>
    </div>
  )
}
