import { YearResult, Zone, ZONE_COLORS } from '../../engine'

interface ProjectionTableProps {
  years: YearResult[]
  startingYear: number
  selectedYearIndex: number
  stockPrice: number
  stockPriceChange: number | null // null = current, number = percentage change
}

export function ProjectionTable({
  years,
  startingYear,
  selectedYearIndex,
  stockPrice,
  stockPriceChange,
}: ProjectionTableProps) {
  const formatRatio = (ratio: number) => `${ratio.toFixed(2)}x`
  const formatPercent = (pct: number) => `${Math.round(pct)}%`
  
  // Format stock price indicator
  const priceIndicator = stockPriceChange === null 
    ? `@ $${Math.round(stockPrice).toLocaleString()} (current)`
    : stockPriceChange > 0
      ? `@ $${Math.round(stockPrice).toLocaleString()} (+${Math.round(stockPriceChange)}%)`
      : `@ $${Math.round(stockPrice).toLocaleString()} (${Math.round(stockPriceChange)}%)`
  
  return (
    <div className="space-y-3">
      {/* Stock Price Indicator */}
      <div className="text-sm font-mono text-text-primary">
        {priceIndicator}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-border-primary">
              <th className="text-left text-xxs font-semibold text-text-secondary uppercase tracking-wide py-2 pr-4">
                Year
              </th>
              <th className="text-left text-xxs font-semibold text-text-secondary uppercase tracking-wide py-2 px-4">
                Go/No-Go
              </th>
              <th className="text-right text-xxs font-semibold text-text-secondary uppercase tracking-wide py-2 pl-4">
                RSU %
              </th>
            </tr>
          </thead>
          <tbody>
            {years.map((yearData, index) => {
              const calendarYear = startingYear + index
              const isSelected = index === selectedYearIndex
              
              return (
                <tr 
                  key={calendarYear}
                  className={`
                    border-b border-border-primary transition-colors
                    ${isSelected ? 'bg-bg-highlight' : 'hover:bg-bg-card'}
                  `}
                >
                  <td className="py-3 pr-4">
                    <span className={`text-sm font-mono ${isSelected ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>
                      {calendarYear}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className="text-sm font-mono"
                      style={{ color: ZONE_COLORS[yearData.zone] }}
                    >
                      {formatRatio(yearData.goNoGo)} {yearData.zone}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span className="text-sm font-mono text-text-primary">
                      {formatPercent(yearData.rsuPercent)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
