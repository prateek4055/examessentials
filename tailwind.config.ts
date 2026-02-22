import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        "clay-sm": "4px 4px 8px #c8ccd4, -4px -4px 8px #ffffff",
        "clay-md": "8px 8px 16px #c8ccd4, -8px -8px 16px #ffffff",
        "clay-lg": "12px 12px 24px #c8ccd4, -12px -12px 24px #ffffff",
        "clay-inner": "inset 4px 4px 8px #c8ccd4, inset -4px -4px 8px #ffffff",
        "clay-btn": "6px 6px 12px #c8ccd4, -6px -6px 12px #ffffff",
        "glass-sm": "0 4px 16px rgba(100, 120, 180, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        "glass-md": "0 8px 32px rgba(100, 120, 180, 0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
        "glass-lg": "0 16px 48px rgba(100, 120, 180, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      colors: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          red: "hsl(var(--brand-red))",
          green: "hsl(var(--brand-green))",
          blue: "hsl(var(--brand-blue))",
          orange: "hsl(var(--brand-orange))",
          pink: "hsl(var(--brand-pink))",
        },
        gradient: {
          purple: "hsl(var(--gradient-purple))",
          blue: "hsl(var(--gradient-blue))",
          pink: "hsl(var(--gradient-pink))",
          orange: "hsl(var(--gradient-orange))",
        },
        doodle: {
          green: "hsl(var(--doodle-green))",
          blue: "hsl(var(--doodle-blue))",
          pink: "hsl(var(--doodle-pink))",
          orange: "hsl(var(--doodle-orange))",
        },
        medical: {
          bg: "#F4F7FB",
          primary: "#3b82f6",
          accent: "#14b8a6",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        handwritten: ["Caveat", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        shimmer: "shimmer 8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
