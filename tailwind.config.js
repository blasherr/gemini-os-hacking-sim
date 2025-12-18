/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        macos: {
          bg: '#1e1e1e',
          sidebar: '#2d2d2d',
          topbar: '#323232',
          window: '#252525',
          text: '#ffffff',
          'text-secondary': '#a0a0a0',
          accent: '#0a84ff',
          red: '#ff453a',
          yellow: '#ffd60a',
          green: '#32d74b',
        },
        terminal: {
          bg: '#000000',
          text: '#00ff00',
        },
        hacker: {
          primary: '#00ff00',
          secondary: '#00cc00',
          danger: '#ff0000',
          warning: '#ffff00',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
