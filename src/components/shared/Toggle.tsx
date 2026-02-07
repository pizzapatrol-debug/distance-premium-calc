interface ToggleOption {
  value: string
  label: string
}

interface ToggleProps {
  options: [ToggleOption, ToggleOption]
  value: string
  onChange: (value: string) => void
  label?: string
  helpText?: string
}

export function Toggle({ options, value, onChange, label, helpText }: ToggleProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-text-primary block">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 py-2.5 px-4 rounded-md text-sm font-medium
              border transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-accent/20
              ${value === option.value 
                ? 'bg-accent border-accent text-text-primary' 
                : 'bg-bg-card border-border-primary text-text-secondary hover:border-accent/50'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      {helpText && (
        <p className="text-xs text-text-secondary">{helpText}</p>
      )}
    </div>
  )
}
