interface EscapeRouteComparisonProps {
  salaryGap: number
  relocationCost: number
  lowerCostExit: 'local' | 'relocate'
}

const formatCurrency = (value: number): string => {
  return `$${Math.round(value).toLocaleString('en-US')}/yr`
}

export function EscapeRouteComparison({
  salaryGap,
  relocationCost,
  lowerCostExit,
}: EscapeRouteComparisonProps) {
  const maxValue = Math.max(salaryGap, relocationCost)
  
  const localFill = (salaryGap / maxValue) * 100
  const relocateFill = (relocationCost / maxValue) * 100
  
  return (
    <div className="space-y-4">
      <h3 className="text-xxs font-semibold text-accent uppercase tracking-wide">
        Escape Route Comparison
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Stay Local */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-text-primary">Stay Local</div>
          <div className="h-3 bg-bg-highlight rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${localFill}%` }}
            />
          </div>
          <div className="text-sm font-mono text-text-primary">
            {formatCurrency(salaryGap)}
          </div>
          <div className="text-xs text-text-secondary">Salary Gap</div>
          {lowerCostExit === 'local' && (
            <div className="flex items-center gap-1 text-xs text-zone-go">
              <span>✓</span>
              <span>Lower cost exit</span>
            </div>
          )}
        </div>
        
        {/* Relocate */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-text-primary">Relocate</div>
          <div className="h-3 bg-bg-highlight rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${relocateFill}%` }}
            />
          </div>
          <div className="text-sm font-mono text-text-primary">
            {formatCurrency(relocationCost)}
          </div>
          <div className="text-xs text-text-secondary">Relocation Cost</div>
          {lowerCostExit === 'relocate' && (
            <div className="flex items-center gap-1 text-xs text-zone-go">
              <span>✓</span>
              <span>Lower cost exit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
