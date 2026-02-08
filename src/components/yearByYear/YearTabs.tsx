interface YearTabsProps {
  years: number[]
  selectedYear: number
  onSelectYear: (year: number) => void
}

export function YearTabs({ years, selectedYear, onSelectYear }: YearTabsProps) {
  return (
    <div 
      className="flex gap-1 overflow-x-auto"
      role="tablist"
      aria-label="Year selection"
    >
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          role="tab"
          aria-selected={year === selectedYear}
          className={`
            px-4 py-2 rounded-md text-sm font-medium
            transition-all duration-150 flex-shrink-0
            focus:outline-none focus:ring-2 focus:ring-accent/20
            ${year === selectedYear
              ? 'bg-accent text-text-primary'
              : 'bg-bg-card border border-border-primary text-text-secondary hover:border-accent/50'
            }
          `}
        >
          {year}
        </button>
      ))}
    </div>
  )
}
