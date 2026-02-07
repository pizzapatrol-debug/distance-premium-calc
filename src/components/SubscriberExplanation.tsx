import { Link } from 'react-router-dom'

export function SubscriberExplanation() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-primary rounded-lg max-w-md w-full p-8 text-center">
        <h1 className="text-xl font-medium text-text-primary mb-4">
          Year-by-Year Module
        </h1>
        
        <p className="text-sm text-text-secondary mb-4">
          This module is available to paid subscribers.
        </p>
        
        <p className="text-sm text-text-secondary mb-4">
          If you're a subscriber, the access link is in your welcome email and monthly updates.
        </p>
        
        <p className="text-sm text-text-secondary mb-6">
          Not a subscriber? The basic calculator is free.
        </p>
        
        <Link
          to="/"
          className="inline-block w-full py-3 px-4 rounded-md font-medium text-sm
                     bg-accent text-text-primary hover:bg-accent/90 transition-colors"
        >
          Go to Basic Calculator
        </Link>
      </div>
    </div>
  )
}
