import { useRef, useEffect, useState } from 'react'
import { Zone, ZONE_COLORS, ZONE_DESCRIPTIONS, StockThresholds } from '../../engine'

interface StockSliderProps {
  currentPrice: number
  thresholds: StockThresholds
  currentZone: Zone
  currentRatio: number
  onPriceChange: (price: number) => void
}

export function StockSlider({
  currentPrice,
  thresholds,
  currentZone,
  currentRatio,
  onPriceChange,
}: StockSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [sliderPrice, setSliderPrice] = useState(currentPrice)
  
  // Calculate range based on thresholds
  const minThreshold = thresholds.caution ?? thresholds.go ?? thresholds.strong ?? 50
  const minPrice = Math.max(50, Math.floor(minThreshold * 0.9))
  const maxPrice = Math.ceil(currentPrice * 1.3)
  
  // Reset slider price when current price changes externally
  useEffect(() => {
    if (!isDragging) {
      setSliderPrice(currentPrice)
    }
  }, [currentPrice, isDragging])
  
  // Calculate position percentage for a price
  const getPosition = (price: number) => {
    return ((price - minPrice) / (maxPrice - minPrice)) * 100
  }
  
  // Calculate price from position percentage
  const getPrice = (position: number) => {
    return Math.round(minPrice + (position / 100) * (maxPrice - minPrice))
  }
  
  // Handle mouse/touch interaction
  const handleInteraction = (clientX: number) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const position = ((clientX - rect.left) / rect.width) * 100
    const clampedPosition = Math.max(0, Math.min(100, position))
    const newPrice = getPrice(clampedPosition)
    
    setSliderPrice(newPrice)
    onPriceChange(newPrice)
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleInteraction(e.clientX)
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX)
    }
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newPrice = sliderPrice
    
    if (e.key === 'ArrowLeft') {
      newPrice = e.shiftKey ? sliderPrice - 10 : sliderPrice - 1
    } else if (e.key === 'ArrowRight') {
      newPrice = e.shiftKey ? sliderPrice + 10 : sliderPrice + 1
    }
    
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice))
    setSliderPrice(newPrice)
    onPriceChange(newPrice)
  }
  
  // Calculate gap to nearest threshold
  const nearestThreshold = thresholds.strong && sliderPrice > thresholds.strong
    ? { zone: 'Strong' as Zone, price: thresholds.strong }
    : thresholds.go && sliderPrice > thresholds.go
      ? { zone: 'Go' as Zone, price: thresholds.go }
      : thresholds.caution && sliderPrice > thresholds.caution
        ? { zone: 'Caution' as Zone, price: thresholds.caution }
        : null
  
  const gapAmount = nearestThreshold ? sliderPrice - nearestThreshold.price : 0
  const gapPercent = nearestThreshold ? (gapAmount / sliderPrice) * 100 : 0
  
  const formatCurrency = (val: number) => `$${Math.round(val).toLocaleString()}`
  
  return (
    <div className="space-y-4">
      {/* Slider Track */}
      <div className="relative pt-6 pb-8">
        {/* Zone labels above track */}
        <div className="absolute top-0 left-0 right-0 flex justify-between text-xxs text-text-secondary px-2">
          {thresholds.caution && (
            <span style={{ left: `${getPosition(thresholds.caution)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              Caution
            </span>
          )}
          {thresholds.go && (
            <span style={{ left: `${getPosition(thresholds.go)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              Go
            </span>
          )}
          {thresholds.strong && (
            <span style={{ left: `${getPosition(thresholds.strong)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              Strong
            </span>
          )}
        </div>
        
        {/* Track */}
        <div 
          ref={sliderRef}
          className="relative h-2 bg-bg-highlight rounded-full cursor-pointer"
          onMouseDown={handleMouseDown}
          role="slider"
          aria-valuenow={sliderPrice}
          aria-valuemin={minPrice}
          aria-valuemax={maxPrice}
          aria-label={`Stock price: $${sliderPrice}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Threshold markers */}
          {thresholds.caution && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4"
              style={{ 
                left: `${getPosition(thresholds.caution)}%`,
                backgroundColor: ZONE_COLORS.Caution,
              }}
            />
          )}
          {thresholds.go && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4"
              style={{ 
                left: `${getPosition(thresholds.go)}%`,
                backgroundColor: ZONE_COLORS.Go,
              }}
            />
          )}
          {thresholds.strong && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4"
              style={{ 
                left: `${getPosition(thresholds.strong)}%`,
                backgroundColor: ZONE_COLORS.Strong,
              }}
            />
          )}
          
          {/* Marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-bg-primary shadow-lg transition-all duration-100"
            style={{ 
              left: `${getPosition(sliderPrice)}%`,
              backgroundColor: ZONE_COLORS[currentZone],
            }}
          />
        </div>
        
        {/* Price labels below track */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xxs text-text-secondary">
          {thresholds.caution && (
            <span style={{ left: `${getPosition(thresholds.caution)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              {formatCurrency(thresholds.caution)}
            </span>
          )}
          {thresholds.go && (
            <span style={{ left: `${getPosition(thresholds.go)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              {formatCurrency(thresholds.go)}
            </span>
          )}
          {thresholds.strong && (
            <span style={{ left: `${getPosition(thresholds.strong)}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
              {formatCurrency(thresholds.strong)}
            </span>
          )}
          <span style={{ right: 0, position: 'absolute' }}>
            {formatCurrency(maxPrice)}
          </span>
        </div>
      </div>
      
      {/* Gap Display */}
      <div className="text-center space-y-1">
        <div 
          className="text-lg font-mono font-semibold"
          style={{ color: ZONE_COLORS[currentZone] }}
        >
          {currentRatio.toFixed(2)}x {currentZone}
        </div>
        <div className="text-sm text-text-secondary">
          {ZONE_DESCRIPTIONS[currentZone]}
        </div>
        {nearestThreshold && gapAmount > 0 && (
          <div className="text-sm text-text-secondary">
            {formatCurrency(gapAmount)} ({Math.round(gapPercent)}%) above {nearestThreshold.zone} threshold
          </div>
        )}
      </div>
    </div>
  )
}
