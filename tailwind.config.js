// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand Color Palette */
        brand: {
          celeste: '#6ED0E0',
          'dark-blue': '#0F6FB7',
          sun: '#FFB84D'
        },
        'brand-celeste': {
          50: 'hsl(var(--brand-celeste-50))',
          100: 'hsl(var(--brand-celeste-100))',
          200: 'hsl(var(--brand-celeste-200))',
          300: 'hsl(var(--brand-celeste-300))',
          400: 'hsl(var(--brand-celeste-400))',
          500: 'hsl(var(--brand-celeste-500))',
          600: 'hsl(var(--brand-celeste-600))',
          700: 'hsl(var(--brand-celeste-700))',
          800: 'hsl(var(--brand-celeste-800))',
          900: 'hsl(var(--brand-celeste-900))',
          DEFAULT: 'hsl(var(--brand-celeste-400))'
        },
        'brand-dark-blue': {
          50: 'hsl(var(--brand-dark-blue-50))',
          100: 'hsl(var(--brand-dark-blue-100))',
          200: 'hsl(var(--brand-dark-blue-200))',
          300: 'hsl(var(--brand-dark-blue-300))',
          400: 'hsl(var(--brand-dark-blue-400))',
          500: 'hsl(var(--brand-dark-blue-500))',
          600: 'hsl(var(--brand-dark-blue-600))',
          700: 'hsl(var(--brand-dark-blue-700))',
          800: 'hsl(var(--brand-dark-blue-800))',
          900: 'hsl(var(--brand-dark-blue-900))',
          DEFAULT: 'hsl(var(--brand-dark-blue-600))'
        },
        'brand-sun': {
          50: 'hsl(var(--brand-sun-50))',
          100: 'hsl(var(--brand-sun-100))',
          200: 'hsl(var(--brand-sun-200))',
          300: 'hsl(var(--brand-sun-300))',
          400: 'hsl(var(--brand-sun-400))',
          500: 'hsl(var(--brand-sun-500))',
          600: 'hsl(var(--brand-sun-600))',
          700: 'hsl(var(--brand-sun-700))',
          800: 'hsl(var(--brand-sun-800))',
          900: 'hsl(var(--brand-sun-900))',
          DEFAULT: 'hsl(var(--brand-sun-500))'
        },

        /* Legacy Colors - maintaining backward compatibility */
        web_dark: '#2D2D2D',
        web_lightwhite: '#FAFAFA',
        web_borderGray: '#DDD',
        web_grayblack: '#3F3F3F',
        web_darkgray: '#595959',
        web_lightgray: '#E9E9E9',
        web_lightbrown: '#EC9430',
        web_darkbrown: '#E08824',
        web_green: '#52C24A',

        /* Legacy color aliases - now using brand colors */
        web_lightBlue: 'hsl(var(--web-light-blue))',
        web_darkBlue: 'hsl(var(--web-dark-blue))',
        web_aquablue: 'hsl(var(--web-aqua-blue))',

        web_red: '#FF0000',
        web_aquaBtnblue: '#1C74B9',
        web_lightGrey: '#E8E8E8',
        mweb_butnColor: '#207EC3',
        web_placeHolder: '#C1C1C1',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'transparent', // Remove solid background to allow glass effects
          background: 'hsl(var(--sidebar-background))', // Available as bg-sidebar-background when needed
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        selection: {
          DEFAULT: 'hsl(var(--selection-bg))',
          foreground: 'hsl(var(--selection-text))'
        },
        'glass-text': {
          primary: 'hsl(var(--glass-text-primary))',
          secondary: 'hsl(var(--glass-text-secondary))'
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade": {
          "0%": { opacity: 0.3 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0.3 },
        },
        "shimmer": {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "spin": {
          from: { transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(0deg)' },
          to: { transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(360deg)' }
        },
        "beat": {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.4)' },
        },
        "pulse": {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.5)', opacity: 0.5 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin": "spin 1s linear infinite",
        "fade": "fade 2s infinite",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        /* Enhanced Border Radius - Windows 11 Fluent Design */
        'fluent-sm': '8px',
        'fluent-md': '12px',
        'fluent-lg': '16px',
        'fluent-xl': '24px'
      },
      /* Glassmorphism & Modern Design Tokens */
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '30px',
        '2xl': '40px'
      },
      backdropSaturate: {
        105: '1.05',
        110: '1.1',
        115: '1.15',
        120: '1.2',
        130: '1.3',
        150: '1.5'
      },
      /* Modern Spacing Tokens */
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem'
      },
      gap: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem'
      },
      /* Enhanced Box Shadow - Elevation & Glow System */
      boxShadow: {
        /* Elevation Shadows */
        'elevation-1': '0 1px 3px hsl(var(--brand-dark-blue-900) / 0.08), 0 1px 2px hsl(var(--brand-dark-blue-900) / 0.05)',
        'elevation-2': '0 3px 6px hsl(var(--brand-dark-blue-900) / 0.10), 0 2px 4px hsl(var(--brand-dark-blue-900) / 0.05)',
        'elevation-3': '0 6px 16px hsl(var(--brand-dark-blue-900) / 0.10), 0 3px 6px hsl(var(--brand-dark-blue-900) / 0.05)',
        'elevation-4': '0 12px 24px hsl(var(--brand-dark-blue-900) / 0.12), 0 6px 12px hsl(var(--brand-dark-blue-900) / 0.06)',
        'elevation-5': '0 20px 40px hsl(var(--brand-dark-blue-900) / 0.14), 0 10px 20px hsl(var(--brand-dark-blue-900) / 0.08)',

        /* Brand-colored Glow Effects */
        'glow-subtle': '0 0 20px hsl(var(--brand-celeste-400) / 0.3), 0 0 40px hsl(var(--brand-celeste-400) / 0.15)',
        'glow-medium': '0 0 30px hsl(var(--brand-celeste-400) / 0.4), 0 0 60px hsl(var(--brand-celeste-400) / 0.2)',
        'glow-strong': '0 0 40px hsl(var(--brand-celeste-400) / 0.5), 0 0 80px hsl(var(--brand-celeste-400) / 0.25)',

        'glow-celeste-subtle': '0 0 20px hsl(var(--brand-celeste-400) / 0.3), 0 0 40px hsl(var(--brand-celeste-400) / 0.15)',
        'glow-celeste-medium': '0 0 30px hsl(var(--brand-celeste-400) / 0.4), 0 0 60px hsl(var(--brand-celeste-400) / 0.2)',
        'glow-celeste-strong': '0 0 40px hsl(var(--brand-celeste-400) / 0.5), 0 0 80px hsl(var(--brand-celeste-400) / 0.25)',

        'glow-dark-blue-subtle': '0 0 20px hsl(var(--brand-dark-blue-400) / 0.3), 0 0 40px hsl(var(--brand-dark-blue-400) / 0.15)',
        'glow-dark-blue-medium': '0 0 30px hsl(var(--brand-dark-blue-400) / 0.4), 0 0 60px hsl(var(--brand-dark-blue-400) / 0.2)',
        'glow-dark-blue-strong': '0 0 40px hsl(var(--brand-dark-blue-400) / 0.5), 0 0 80px hsl(var(--brand-dark-blue-400) / 0.25)',

        'glow-sun-subtle': '0 0 20px hsl(var(--brand-sun-400) / 0.3), 0 0 40px hsl(var(--brand-sun-400) / 0.15)',
        'glow-sun-medium': '0 0 30px hsl(var(--brand-sun-400) / 0.4), 0 0 60px hsl(var(--brand-sun-400) / 0.2)',
        'glow-sun-strong': '0 0 40px hsl(var(--brand-sun-400) / 0.5), 0 0 80px hsl(var(--brand-sun-400) / 0.25)',

        /* Glass Effect Combinations */
        'glass-subtle': '0 4px 16px hsl(var(--brand-dark-blue-900) / 0.1), inset 0 1px 0 hsl(255 255 255 / 0.2)',
        'glass-medium': '0 8px 32px hsl(var(--brand-dark-blue-900) / 0.15), inset 0 1px 0 hsl(255 255 255 / 0.3)',
        'glass-strong': '0 12px 48px hsl(var(--brand-dark-blue-900) / 0.2), inset 0 1px 0 hsl(255 255 255 / 0.4)',

        /* Windows 11 Specific */
        'mica': '0 2px 8px hsl(var(--brand-dark-blue-900) / 0.08), inset 0 1px 0 hsl(255 255 255 / 0.15)',
        'acrylic': '0 16px 64px hsl(var(--brand-dark-blue-900) / 0.18), inset 0 1px 0 hsl(255 255 255 / 0.35)',
        'fluent': '0 8px 24px hsl(var(--brand-dark-blue-900) / 0.12), 0 4px 8px hsl(var(--brand-dark-blue-900) / 0.08), inset 0 1px 0 hsl(255 255 255 / 0.25)'
      },
      /* Enhanced Transition Properties */
      transitionProperty: {
        'glass': 'backdrop-filter, background, box-shadow, border',
        'elevation': 'box-shadow, transform'
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms'
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3200px'
    }
  },
  plugins: [nextui(), require("tailwindcss-animate")],
};
