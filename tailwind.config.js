/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':      '#FFFFFF',
        'bg-surface':   '#F8FAFF',
        'bg-band':      '#EEF2FF',
        'text-primary': '#080818',
        'text-muted':   '#6B7280',
        'accent':       '#2563EB',
        'accent-mid':   '#3B82F6',
        'accent-light': '#BFDBFE',
        'accent-glow':  'rgba(37,99,235,0.12)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        ui:      ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        btn:   '4px',
        panel: '20px',
      },
    },
  },
  plugins: [],
}
