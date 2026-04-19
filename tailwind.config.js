// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    // Harbor library source — transpilePackages feeds these to SWC,
    // Tailwind scans them so utilities like bg-surface / text-fg /
    // shadow-harbor-glow land in the bundle.
    "../harbor/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Harbor accents */
        accent: "rgb(var(--harbor-accent) / <alpha-value>)",
        "accent-2": "rgb(var(--harbor-accent-2) / <alpha-value>)",
        "accent-3": "rgb(var(--harbor-accent-3) / <alpha-value>)",

        /* Harbor semantic tones */
        success: "rgb(var(--harbor-success) / <alpha-value>)",
        warning: "rgb(var(--harbor-warning) / <alpha-value>)",
        danger: "rgb(var(--harbor-danger) / <alpha-value>)",
        info: "rgb(var(--harbor-info) / <alpha-value>)",

        /* Harbor surfaces */
        surface: {
          DEFAULT: "rgb(var(--harbor-bg) / <alpha-value>)",
          1: "rgb(var(--harbor-bg-elev-1) / <alpha-value>)",
          2: "rgb(var(--harbor-bg-elev-2) / <alpha-value>)",
          3: "rgb(var(--harbor-bg-elev-3) / <alpha-value>)",
        },

        /* Harbor foreground tones */
        fg: {
          DEFAULT: "rgb(var(--harbor-text) / <alpha-value>)",
          muted: "rgb(var(--harbor-text-muted) / <alpha-value>)",
          subtle: "rgb(var(--harbor-text-subtle) / <alpha-value>)",
        },

        /* Shadcn semantic shim — points at the remapped CSS vars in
         * globals.css, which in turn point at Harbor tokens. Keeps any
         * surviving shadcn class (bg-background, text-foreground …)
         * rendering in the Harbor dark palette. */
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },

      borderRadius: {
        sm: "var(--harbor-radius-sm)",
        md: "var(--harbor-radius-md)",
        lg: "var(--harbor-radius-lg)",
        xl: "var(--harbor-radius-xl)",
        "2xl": "var(--harbor-radius-2xl)",
      },

      boxShadow: {
        "harbor-sm":   "var(--harbor-shadow-sm)",
        "harbor-md":   "var(--harbor-shadow-md)",
        "harbor-lg":   "var(--harbor-shadow-lg)",
        "harbor-glow": "var(--harbor-shadow-glow)",
      },

      transitionDuration: {
        instant: "var(--harbor-dur-instant)",
        fast:    "var(--harbor-dur-fast)",
        base:    "var(--harbor-dur-base)",
        slow:    "var(--harbor-dur-slow)",
        slower:  "var(--harbor-dur-slower)",
      },
      transitionTimingFunction: {
        out:      "var(--harbor-ease-out)",
        "in-out": "var(--harbor-ease-in-out)",
        spring:   "var(--harbor-ease-spring)",
      },

      fontFamily: {
        sans: ["var(--harbor-font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--harbor-font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },

      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%":      { opacity: "1",    transform: "scale(1.02)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition:  "1000px 0" },
        },
        mesh: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%":      { transform: "translate(30px, -20px) scale(1.1)" },
          "66%":      { transform: "translate(-20px, 30px) scale(0.95)" },
        },
        "accordion-down": {
          from: { height: 0 },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: 0 },
        },
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        mesh:    "mesh 18s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },

    screens: {
      sm:   "640px",
      md:   "768px",
      lg:   "1024px",
      xl:   "1280px",
      "2xl":"1536px",
    },
  },
  plugins: [nextui()],
};
