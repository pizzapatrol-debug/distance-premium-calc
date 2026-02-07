import { ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SubscriberExplanation } from './SubscriberExplanation'

const VALID_TOKENS = (import.meta.env.VITE_VALID_TOKENS || '').split(',').filter(Boolean)
const STORAGE_KEY = 'yby_access'

interface TokenGateProps {
  children: ReactNode
}

export function TokenGate({ children }: TokenGateProps) {
  const [searchParams] = useSearchParams()
  const [isValid, setIsValid] = useState<boolean | null>(null)
  
  useEffect(() => {
    const urlToken = searchParams.get('access')
    const storedToken = localStorage.getItem(STORAGE_KEY)
    const token = urlToken || storedToken
    
    // Check if token is valid
    const valid = token ? VALID_TOKENS.includes(token) : false
    
    if (valid) {
      // Store valid token for future visits
      if (urlToken && urlToken !== storedToken) {
        localStorage.setItem(STORAGE_KEY, urlToken)
      }
      setIsValid(true)
    } else {
      // Clear invalid stored token
      if (storedToken) {
        localStorage.removeItem(STORAGE_KEY)
      }
      setIsValid(false)
    }
  }, [searchParams])
  
  // Loading state
  if (isValid === null) {
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
  
  // Not valid - show explanation
  if (!isValid) {
    return <SubscriberExplanation />
  }
  
  // Valid - show children (will go through ConsentGate next)
  return <>{children}</>
}
