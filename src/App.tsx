import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConsentGate } from './components/shared'
import { BasicCalculator } from './components/basic'
import { TokenGate } from './components/TokenGate'

// Lazy load Year-by-Year module
const YearByYearCalculator = lazy(() => 
  import('./components/yearByYear/YearByYearCalculator').then(m => ({ default: m.YearByYearCalculator }))
)

// Loading component
function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '400ms' }} />
      </div>
      <p className="text-sm text-text-secondary">Loading module...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Basic Calculator - Public with consent gate */}
        <Route 
          path="/" 
          element={
            <ConsentGate>
              <BasicCalculator />
            </ConsentGate>
          } 
        />
        
        {/* Year-by-Year - Token gate → Consent gate → Calculator */}
        <Route 
          path="/year-by-year" 
          element={
            <Suspense fallback={<Loading />}>
              <TokenGate>
                <ConsentGate>
                  <YearByYearCalculator />
                </ConsentGate>
              </TokenGate>
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}
