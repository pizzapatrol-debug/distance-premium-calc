import { useState, useEffect, useRef } from 'react'

interface NumberInputProps {
  value: number | null
  onChange: (value: number | null) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
  suffix?: string
  className?: string
  min?: number
  max?: number
}

export function NumberInput({
  value,
  onChange,
  label,
  helpText,
  error,
  disabled = false,
  suffix,
  className = '',
  min,
  max,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Sync display value with prop value
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toString())
    } else {
      setDisplayValue('')
    }
  }, [value])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    
    // Allow empty
    if (raw === '') {
      setDisplayValue('')
      onChange(null)
      return
    }
    
    // Only allow numbers and one decimal point
    if (!/^-?\d*\.?\d*$/.test(raw)) {
      return
    }
    
    setDisplayValue(raw)
    
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) {
      // Apply min/max constraints
      let constrained = parsed
      if (min !== undefined && constrained < min) constrained = min
      if (max !== undefined && constrained > max) constrained = max
      onChange(constrained)
    } else {
      onChange(null)
    }
  }
  
  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          className={`
            w-full h-12 px-3
            bg-bg-input border rounded-md
            text-text-primary font-mono
            placeholder:text-text-secondary/50
            focus:outline-none focus:ring-2 focus:ring-accent/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
            ${suffix ? 'pr-12' : ''}
            ${error ? 'border-zone-stop' : 'border-border-primary'}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : helpText ? `${label}-help` : undefined}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p 
          id={`${label}-error`}
          className="text-xs text-zone-stop flex items-center gap-1 animate-fadeIn"
        >
          <span>⚠</span>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${label}-help`} className="text-xs text-text-secondary">
          {helpText}
        </p>
      )}
    </div>
  )
}
