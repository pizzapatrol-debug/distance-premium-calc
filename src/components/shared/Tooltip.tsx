import { ReactNode } from 'react'

interface TooltipProps {
  content: string
  visible: boolean
  children: ReactNode
}

export function Tooltip({ content, visible, children }: TooltipProps) {
  return (
    <div className="relative inline-flex">
      {children}
      
      {visible && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fadeIn"
          role="tooltip"
        >
          <div className="bg-bg-card border border-border-primary rounded px-3 py-2 shadow-lg max-w-[240px]">
            <p className="text-xs text-text-primary whitespace-normal">
              {content}
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div 
              className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border-primary"
            />
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-bg-card"
            />
          </div>
        </div>
      )}
    </div>
  )
}
