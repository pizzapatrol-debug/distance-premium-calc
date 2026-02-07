import { useState, useEffect, ReactNode } from 'react'

const CONSENT_KEY = 'dpc_consent'

interface ConsentGateProps {
  children: ReactNode
}

export function ConsentGate({ children }: ConsentGateProps) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  
  // Check for existing consent on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(CONSENT_KEY)
    setHasConsented(stored === 'true')
  }, [])
  
  const handleContinue = () => {
    sessionStorage.setItem(CONSENT_KEY, 'true')
    setHasConsented(true)
  }
  
  // Loading state
  if (hasConsented === null) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    )
  }
  
  // Already consented
  if (hasConsented) {
    return <>{children}</>
  }
  
  // Consent gate
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-primary rounded-lg max-w-md w-full p-8">
        <h1 className="text-lg font-semibold text-text-primary mb-4">
          Before You Begin
        </h1>
        
        <p className="text-sm text-text-secondary mb-4">
          This calculator provides estimates for informational purposes only. 
          It does not constitute financial, tax, legal, or career advice.
        </p>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="text-accent mt-0.5">•</span>
            Results are based on inputs you provide
          </li>
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="text-accent mt-0.5">•</span>
            Tax estimates are simplified and may not reflect your actual liability
          </li>
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="text-accent mt-0.5">•</span>
            Consult qualified professionals before making decisions
          </li>
        </ul>
        
        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-border-primary bg-bg-input 
                       checked:bg-accent checked:border-accent
                       focus:ring-2 focus:ring-accent/20 focus:ring-offset-0
                       cursor-pointer transition-colors"
          />
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            I understand this calculator provides estimates only and is not a recommendation to take any action.
          </span>
        </label>
        
        <button
          onClick={handleContinue}
          disabled={!isChecked}
          className={`
            w-full py-3 px-4 rounded-md font-medium text-sm
            transition-all duration-150
            ${isChecked 
              ? 'bg-accent text-text-primary hover:bg-accent/90 cursor-pointer' 
              : 'bg-btn-disabled text-text-secondary cursor-not-allowed opacity-40'
            }
          `}
        >
          Continue to Calculator
        </button>
      </div>
    </div>
  )
}
