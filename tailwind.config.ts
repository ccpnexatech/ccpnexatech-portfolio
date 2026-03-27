import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Cores ─────────────────────────────────────────────────────────────
      colors: {
        navy:    { DEFAULT: '#0F1F3D', dark: '#0A0F1E' },
        accent:  { DEFAULT: '#0066FF', light: '#E6F0FF', mid: '#3385FF' },
        cyan:    { DEFAULT: '#00C2E0', light: '#E0F9FD' },
        gold:    { DEFAULT: '#F0A500', light: '#FFF4D6' },
        surface: { DEFAULT: '#F5F7FA' },
        border:  { DEFAULT: '#E2E8F0' },
        text: {
          dark:   '#1A2340',
          muted:  '#6B7A9B',
          light:  '#E8EDF5',
        },
      },

      // ── Tipografia ────────────────────────────────────────────────────────
      fontFamily: {
        syne:  ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono:  ['var(--font-mono)', 'monospace'],
        sans:  ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem',    { lineHeight: '1.1',  letterSpacing: '0.04em', fontWeight: '700' }],
        'h1':      ['2.25rem', { lineHeight: '1.15', letterSpacing: '0.04em', fontWeight: '600' }],
        'h2':      ['1.75rem', { lineHeight: '1.2',  letterSpacing: '0.04em', fontWeight: '600' }],
        'h3':      ['1.25rem', { lineHeight: '1.35', fontWeight: '500' }],
        'h4':      ['1rem',    { lineHeight: '1.4',  fontWeight: '500' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6' }],
        'body':    ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem',   { lineHeight: '1.4' }],
        'cta':     ['0.875rem',  { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '500' }],
        'mono-sm': ['0.8125rem', { lineHeight: '1.5' }],
      },

      // ── Espaçamento ───────────────────────────────────────────────────────
      spacing: {
        'nx-1':  '4px',
        'nx-2':  '8px',
        'nx-3':  '12px',
        'nx-4':  '16px',
        'nx-5':  '24px',
        'nx-6':  '32px',
        'nx-8':  '48px',
        'nx-10': '64px',
        'nx-12': '80px',
        'nx-16': '96px',
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        'nx-sm':   '6px',
        'nx-md':   '12px',
        'nx-lg':   '20px',
        'nx-xl':   '32px',
        'nx-full': '9999px',
      },

      // ── Sombras ───────────────────────────────────────────────────────────
      boxShadow: {
        'nx-xs':     '0 1px 4px rgba(0,0,0,0.04)',
        'nx-sm':     '0 2px 8px rgba(0,0,0,0.06)',
        'nx-md':     '0 4px 16px rgba(0,0,0,0.08)',
        'nx-lg':     '0 8px 32px rgba(0,0,0,0.10)',
        'nx-accent': '0 4px 20px rgba(0,102,255,0.20)',
      },

      // ── Transições ────────────────────────────────────────────────────────
      transitionDuration: {
        'nx-fast':    '150ms',
        'nx-default': '200ms',
        'nx-smooth':  '400ms',
        'nx-bounce':  '500ms',
        'nx-slow':    '600ms',
      },
      transitionTimingFunction: {
        'nx-default': 'ease-out',
        'nx-smooth':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'nx-bounce':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'nx-slow':    'ease-in-out',
      },

      // ── Animações ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-right': {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up':     'fade-up 400ms ease-out both',
        'fade-in':     'fade-in 400ms ease-out both',
        'scale-in':    'scale-in 400ms cubic-bezier(0.4,0,0.2,1) both',
        'slide-right': 'slide-right 400ms ease-out both',
      },

      // ── Max Width ─────────────────────────────────────────────────────────
      maxWidth: {
        'prose-nx': '68ch',
        'section':  '1200px',
      },
    },
  },
  plugins: [],
}

export default config
