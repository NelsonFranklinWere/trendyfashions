import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        secondary: '#e67e22',
        accent: '#2980b9',
        dark: '#1a1a2e',
        light: '#f8f9fa',
        text: '#2c3e50',
        whatsapp: '#25D366',
        nairobi: {
          green: '#2ecc71',
          orange: '#e67e22',
          blue: '#3498db',
          red: '#e74c3c',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'medium': '0 8px 24px rgba(44, 62, 80, 0.12), 0 1.5px 6px rgba(230, 103, 34, 0.10)',
        'large': '0 12px 32px rgba(44, 62, 80, 0.18), 0 2px 8px rgba(230, 103, 34, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

