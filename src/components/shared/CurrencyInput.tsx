import { useState, useEffect, useRef } from 'react'

interface CurrencyInputProps {
  value: number | null
  onChange: (value: number | null) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function CurrencyInput({
  value,
  onChange,
  label,
  helpText,
  error,
  disabled = false,
  className = '',
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
  }
  
  // Parse formatted string back to number
  const parseNumber = (str: string): number | null => {
    const cleaned = str.replace(/[^0-9.-]/g, '')
    if (cleaned === '' || cleaned === '-') return null
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }
  
  // Sync display value with prop value
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplayValue(formatNumber(value))
    } else {
      setDisplayValue('')
    }
  }, [value])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    
    // Allow empty
    if (raw === '' || raw === '$') {
      setDisplayValue('')
      onChange(null)
      return
    }
    
    // Remove $ and existing commas to get raw input
    const withoutPrefix = raw.replace(/^\$\s*/, '')
    const withoutCommas = withoutPrefix.replace(/,/g, '')
    
    // Only allow numbers and one decimal point
    if (!/^-?\d*\.?\d*$/.test(withoutCommas)) {
      return
    }
    
    // Parse and format
    const parsed = parseNumber(withoutCommas)
    if (parsed !== null) {
      // Format with commas while preserving cursor position
      const formatted = formatNumber(parsed)
      setDisplayValue(formatted)
      onChange(parsed)
    } else {
      setDisplayValue(withoutCommas)
      onChange(null)
    }
  }
  
  const handleFocus = () => {
    // Select all on focus for easy replacement
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          className={`
            w-full h-12 pl-7 pr-3 
            bg-bg-input border rounded-md
            text-text-primary font-mono
            placeholder:text-text-secondary/50
            focus:outline-none focus:ring-2 focus:ring-accent/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
            ${error ? 'border-zone-stop' : 'border-border-primary'}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : helpText ? `${label}-help` : undefined}
        />
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
