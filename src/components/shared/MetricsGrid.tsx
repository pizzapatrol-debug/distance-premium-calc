import { useState } from 'react'
import { Tooltip } from './Tooltip'

interface Metric {
  label: string
  subtext: string
  value: string | null
  tooltip: string
}

interface MetricsGridProps {
  escapePenalty: number | null
  travelExpense: number | null
  distancePremium: number | null
  skyRate: number | null
  isEmpty?: boolean
}

const formatCurrency = (value: number | null): string | null => {
  if (value === null) return null
  return `$${Math.round(value).toLocaleString('en-US')}`
}

const formatRate = (value: number | null): string | null => {
  if (value === null) return null
  return `$${Math.round(value).toLocaleString('en-US')}/hr`
}

export function MetricsGrid({
  escapePenalty,
  travelExpense,
  distancePremium,
  skyRate,
  isEmpty = false,
}: MetricsGridProps) {
  const metrics: Metric[] = [
    {
      label: 'Escape Penalty',
      subtext: 'What the trap charges',
      value: formatCurrency(escapePenalty),
      tooltip: 'The minimum cost to leave the trap through conventional means',
    },
    {
      label: 'Travel Expense',
      subtext: 'What the corridor costs',
      value: formatCurrency(travelExpense),
      tooltip: 'Total annual cost of flights, housing, and ground transportation',
    },
    {
      label: 'Distance Premium',
      subtext: 'What you capture',
      value: formatCurrency(distancePremium),
      tooltip: 'Annual wealth built by traveling instead of escaping',
    },
    {
      label: 'Sky Rate',
      subtext: 'Per hour in the air',
      value: formatRate(skyRate),
      tooltip: 'Effective hourly rate for time spent flying',
    },
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} isEmpty={isEmpty} />
      ))}
    </div>
  )
}

function MetricCard({ metric, isEmpty }: { metric: Metric; isEmpty: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="bg-bg-card border border-border-primary rounded-lg p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xxs font-semibold text-text-secondary uppercase tracking-wide">
              {metric.label}
            </span>
            <Tooltip content={metric.tooltip} visible={showTooltip}>
              <button
                className="text-text-secondary hover:text-text-primary transition-colors w-4 h-4 flex items-center justify-center rounded-full"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label={`Info about ${metric.label}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="7" cy="4" r="0.75" fill="currentColor"/>
                </svg>
              </button>
            </Tooltip>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            {metric.subtext}
          </p>
        </div>
      </div>
      <div className="mt-3">
        {isEmpty || metric.value === null ? (
          <span className="font-mono text-2xl font-semibold text-text-secondary">—</span>
        ) : (
          <span className="font-mono text-2xl font-semibold text-text-primary">
            {metric.value}
          </span>
        )}
      </div>
    </div>
  )
}
