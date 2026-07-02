// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Harbor library source — transpilePackages feeds these to SWC,
    // Tailwind scans them so utilities like bg-surface / text-fg /
    // shadow-harbor-glow AND Harbor-only classes (e.g. Container's
    // max-w-[var(--harbor-container-*)]) land in the bundle.
    // NOTE: the submodule is at frontend/harbor, i.e. ./harbor — NOT
    // ../harbor. The old "../harbor/src" pointed outside the repo at a
    // nonexistent path, so Harbor's source was never scanned and every
    // Harbor-only class got purged (pages rendered full-bleed, no
    // max-width/centering — the "espantoso" layout). Keep this as ./harbor.
    "./harbor/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Harbor's layout primitives (ResponsiveStack, ResponsiveGrid) build their
  // Tailwind classes at RUNTIME via template literals — `gap-${g}`,
  // `${bp}:flex-row`, `${bp}:grid-cols-${n}`. Tailwind's static scanner can't
  // see those, so when Harbor is consumed from source the responsive/spacing
  // utilities get purged and every page collapses (no gaps, rows stay stacked).
  // Safelist the families those primitives generate so they survive the build.
  // (Harbor's published dist ships a prebuilt CSS that already includes these;
  // we consume source, so we regenerate them here.)
  safelist: [
    {
      pattern: /^flex-(row|col|row-reverse|col-reverse)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /^grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /^gap-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
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
          // Semantic surface aliases — these --harbor-surface-* tokens already
          // exist in Harbor's tokens.css and flip per theme; they were referenced
          // in app code (e.g. bg-surface-raised) but never mapped to a utility,
          // so the class emitted no CSS. Map them here. Values are full rgb()
          // strings, so no <alpha-value> channel.
          raised: "var(--harbor-surface-raised)",
          sunken: "var(--harbor-surface-sunken)",
          panel: "var(--harbor-surface-panel)",
          "panel-muted": "var(--harbor-surface-panel-muted)",
          toolbar: "var(--harbor-surface-toolbar)",
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
        border: {
          // DEFAULT keeps the shadcn shim so bare `border-border` is unchanged.
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          // Semantic border strengths — these --harbor-border-* tokens exist in
          // tokens.css and flip per theme; `border-border-subtle` etc. were used
          // in app code but never mapped, emitting no CSS. Full rgb() values.
          subtle: "var(--harbor-border-subtle)",
          default: "var(--harbor-border-default)",
          strong: "var(--harbor-border-strong)",
        },
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
  plugins: [],
};
