import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary Colors
        "primary-white": "#FFFFFF",
        "primary-deep-blue": "#1A2332",
        
        // Secondary Colors
        "secondary-blue-light": "#4A90A4",
        "secondary-blue-pale": "#E8F4F8",
        
        // Accent Colors
        "accent-teal": "#00B4A6",
        "accent-purple": "#6366F1",
        
        // Functional Colors
        "success-green": "#10B981",
        "error-red": "#EF4444",
        "warning-orange": "#F59E0B",
        "neutral-gray": "#6B7280",
        "dark-gray": "#1F2937",
        
        // Background Colors
        "background-pure-white": "#FFFFFF",
        "background-light": "#F9FAFB",
        "background-dark": "#111827",
        "background-card": "#F8FAFC",
        
        // Shadcn/ui standard colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      spacing: {
        '2': '2px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px', letterSpacing: '-0.3px', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '36px', letterSpacing: '-0.2px', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '32px', letterSpacing: '-0.1px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '600' }],
        'body-large': ['18px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.3px', fontWeight: '500' }],
        'button': ['16px', { lineHeight: '24px', letterSpacing: '0.2px', fontWeight: '500' }],
      },
      boxShadow: {
        'card-standard': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'card-elevated': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
