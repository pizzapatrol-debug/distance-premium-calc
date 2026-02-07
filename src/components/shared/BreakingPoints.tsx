interface BreakingPointsProps {
  corridorFloor: number | null
  corridorBuffer: number | null
  localCeiling: number | null
  localBuffer: number | null
  travelCeiling: number | null
  travelBuffer: number | null
  corridorComp: number | null
  localAlt: number | null
  travelExpense: number | null
  isEmpty?: boolean
}

const formatCurrency = (value: number | null): string => {
  if (value === null) return '—'
  return `$${Math.round(value).toLocaleString('en-US')}`
}

const formatShortCurrency = (value: number | null): string => {
  if (value === null) return '—'
  const rounded = Math.round(value)
  if (rounded >= 1000000) {
    return `$${(rounded / 1000000).toFixed(1)}M`
  }
  if (rounded >= 1000) {
    return `$${Math.round(rounded / 1000)}K`
  }
  return `$${rounded}`
}

export function BreakingPoints({
  corridorFloor,
  corridorBuffer,
  localCeiling,
  localBuffer,
  travelCeiling,
  travelBuffer,
  corridorComp,
  localAlt,
  travelExpense,
  isEmpty = false,
}: BreakingPointsProps) {
  // Calculate fill percentages
  // For Corridor Floor: fill = corridorFloor / corridorComp
  // For Local Ceiling: fill = localAlt / localCeiling
  // For Travel Ceiling: fill = travelExpense / travelCeiling
  
  const corridorFill = corridorComp && corridorFloor 
    ? Math.min(100, (corridorFloor / corridorComp) * 100)
    : 0
    
  const localFill = localCeiling && localAlt
    ? Math.min(100, (localAlt / localCeiling) * 100)
    : 0
    
  const travelFill = travelCeiling && travelExpense
    ? Math.min(100, (travelExpense / travelCeiling) * 100)
    : 0
  
  const breakingPoints = [
    {
      label: 'Corridor Floor',
      threshold: corridorFloor,
      buffer: corridorBuffer,
      fill: corridorFill,
    },
    {
      label: 'Local Ceiling',
      threshold: localCeiling,
      buffer: localBuffer,
      fill: localFill,
    },
    {
      label: 'Travel Ceiling',
      threshold: travelCeiling,
      buffer: travelBuffer,
      fill: travelFill,
    },
  ]
  
  if (isEmpty) {
    return (
      <div className="space-y-4">
        <h3 className="text-xxs font-semibold text-accent uppercase tracking-wide">
          Breaking Points
        </h3>
        <div className="space-y-3">
          {breakingPoints.map((bp) => (
            <div key={bp.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">{bp.label}</span>
                <span className="font-mono text-text-secondary">—</span>
              </div>
              <div className="h-2 bg-bg-highlight rounded-full overflow-hidden">
                <div className="h-full w-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-xxs font-semibold text-accent uppercase tracking-wide">
        Breaking Points
      </h3>
      <div className="space-y-3">
        {breakingPoints.map((bp) => (
          <div key={bp.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">{bp.label}</span>
              <span className="font-mono text-text-primary">
                {formatShortCurrency(bp.threshold)}
              </span>
            </div>
            <div className="h-2 bg-bg-highlight rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${bp.fill}%` }}
              />
            </div>
            <div className="text-xxs text-text-secondary text-right">
              {formatCurrency(bp.buffer)} buffer
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
