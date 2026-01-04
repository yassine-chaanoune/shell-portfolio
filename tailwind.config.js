/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        terminal: {
          bg: '#0b0c0e',
          panel: '#0f1115',
          accent: '#4ade80',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}

