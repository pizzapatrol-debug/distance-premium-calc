import { useState, ReactNode, useRef, useEffect } from 'react'

interface CollapsibleProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)
  
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  
  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current
      if (contentEl) {
        setHeight(contentEl.scrollHeight)
        // After animation, set to auto for responsive content
        const timer = setTimeout(() => {
          setHeight(undefined)
        }, 200)
        return () => clearTimeout(timer)
      }
    } else {
      setHeight(0)
    }
  }, [isOpen])
  
  const handleToggle = () => {
    if (isOpen && contentRef.current) {
      // Set explicit height before closing animation
      setHeight(contentRef.current.scrollHeight)
      // Small delay to allow the height to be set before starting collapse
      requestAnimationFrame(() => {
        setIsOpen(false)
      })
    } else {
      setIsOpen(true)
    }
  }
  
  return (
    <div className="border border-border-primary rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left
                   bg-bg-card hover:bg-bg-highlight transition-colors
                   focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.replace(/\s/g, '-')}`}
      >
        <span className="text-sm font-medium text-text-primary">{title}</span>
        <span 
          className={`text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          style={{ transitionDuration: prefersReducedMotion.current ? '0ms' : '200ms' }}
        >
          ▶
        </span>
      </button>
      
      <div 
        id={`collapsible-${title.replace(/\s/g, '-')}`}
        ref={contentRef}
        className="overflow-hidden"
        style={{ 
          height: height !== undefined ? `${height}px` : 'auto',
          transition: prefersReducedMotion.current ? 'none' : 'height 200ms ease-out',
        }}
      >
        <div className="px-4 py-3 border-t border-border-primary bg-bg-primary">
          {children}
        </div>
      </div>
    </div>
  )
}
