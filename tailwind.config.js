/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
        },
        ink: {
          900: 'var(--ink-900)',
          600: 'var(--ink-600)',
          400: 'var(--ink-400)',
        },
        // LedgerWise module tokens
        teal: { DEFAULT: 'rgb(var(--color-teal-primary) / <alpha-value>)', dark: 'rgb(var(--color-teal-dark) / <alpha-value>)' },
        coral: { DEFAULT: 'rgb(var(--color-coral-accent) / <alpha-value>)' },
        // Atlas module tokens
        atlas: {
          navy: '#1E2A4A',
          gold: '#C9A24B',
        },
        success: '#22C55E',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // scoped to /ledgerwise/*
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        sans: ['var(--font-inter)', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      backgroundImage: {
        meridian: 'var(--meridian-gradient)',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(0,0,0,.06)',
        e2: '0 6px 20px -6px rgba(0,0,0,.18)',
        e3: '0 8px 30px -12px rgba(0,0,0,.25)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

