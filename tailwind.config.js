/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg-primary': '#1A1A1A',
        'bg-card': '#2A2A2A',
        'bg-input': '#252525',
        'bg-highlight': '#3A3A3A',
        
        // Border colors
        'border-primary': '#3A3A3A',
        
        // Text colors
        'text-primary': '#E8E6E3',
        'text-secondary': '#9A9A9A',
        
        // Zone colors (muted traffic-light palette)
        'zone-strong': '#5D7A8A',
        'zone-go': '#7A9E7A',
        'zone-caution': '#C4A055',
        'zone-stop': '#B87070',
        
        // Accent
        'accent': '#5D7A8A',
        
        // Button disabled
        'btn-disabled': '#4A4A4A',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xxs': '11px',
      },
      maxWidth: {
        'calculator': '600px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
