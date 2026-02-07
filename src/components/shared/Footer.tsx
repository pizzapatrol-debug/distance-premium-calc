export function Footer() {
  return (
    <footer className="mt-8 pt-6 border-t border-border-primary">
      {/* Logo */}
      <a 
        href="https://substack.com/@1100mileworkday"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-4"
      >
        <img 
          src="/1100_teal.svg" 
          alt="1100 Mile Workday"
          className="h-10 w-auto"
        />
      </a>
      
      {/* Disclaimer */}
      <p className="text-xs text-text-secondary leading-relaxed">
        These are not recommendations. The content in this calculator reflects one person's 
        experience and should not be construed as financial, tax, legal, or career advice. 
        Individual circumstances vary significantly. Consult qualified professionals before 
        making decisions affecting your employment, taxes, or family situation. The creator 
        is not a financial advisor, attorney, or tax professional.
      </p>
    </footer>
  )
}
