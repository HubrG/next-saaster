/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      // screens: {
      //   "2xl": "1400px",
      // },
    },
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui"],
      serif: ["var(--font-serif)", "Georgia"],
      display: ["var(--font-display)", "Comic Sans MS"],
    },
    extend: {
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr))",
      },
      boxShadow: {
        "t-sm": "0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
        "t-md":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "t-lg":
          "0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "t-xl":
          "0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "t-2xl": "0 -25px 50px -12px rgba(0, 0, 0, 0.25)",
        "t-3xl": "0 -35px 60px -15px rgba(0, 0, 0, 0.3)",
        right: "inset -8px 0 8px -10px rgba(128, 108, 156, 0.55)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        text: {
          50: "hsl(var(--text-50))",
          100: "hsl(var(--text-100))",
          200: "hsl(var(--text-200))",
          300: "hsl(var(--text-300))",
          400: "hsl(var(--text-400))",
          500: "hsl(var(--text-500))",
          600: "hsl(var(--text-600))",
          700: "hsl(var(--text-700))",
          800: "hsl(var(--text-800))",
          900: "hsl(var(--text-900))",
          950: "hsl(var(--text-950))",
        },
        theming: {
          text: {
            50: "hsl(var(--text-50))",
            100: "hsl(var(--text-100))",
            200: "hsl(var(--text-200))",
            300: "hsl(var(--text-300))",
            400: "hsl(var(--text-400))",
            500: "hsl(var(--text-500))",
            600: "hsl(var(--text-600))",
            700: "hsl(var(--text-700))",
            800: "hsl(var(--text-800))",
            900: "hsl(var(--text-900))",
            950: "hsl(var(--text-950))",
          },
          background: {
            50: "hsl(var(--background-50))",
            100: "hsl(var(--background-100))",
            200: "hsl(var(--background-200))",
            300: "hsl(var(--background-300))",
            400: "hsl(var(--background-400))",
            500: "hsl(var(--background-500))",
            600: "hsl(var(--background-600))",
            700: "hsl(var(--background-700))",
            800: "hsl(var(--background-800))",
            900: "hsl(var(--background-900))",
            950: "hsl(var(--background-950))",
          },
          primary: {
            50: "hsl(var(--primary-50))",
            100: "hsl(var(--primary-100))",
            200: "hsl(var(--primary-200))",
            300: "hsl(var(--primary-300))",
            400: "hsl(var(--primary-400))",
            500: "hsl(var(--primary-500))",
            600: "hsl(var(--primary-600))",
            700: "hsl(var(--primary-700))",
            800: "hsl(var(--primary-800))",
            900: "hsl(var(--primary-900))",
            950: "hsl(var(--primary-950))",
          },
          secondary: {
            50: "hsl(var(--secondary-50))",
            100: "hsl(var(--secondary-100))",
            200: "hsl(var(--secondary-200))",
            300: "hsl(var(--secondary-300))",
            400: "hsl(var(--secondary-400))",
            500: "hsl(var(--secondary-500))",
            600: "hsl(var(--secondary-600))",
            700: "hsl(var(--secondary-700))",
            800: "hsl(var(--secondary-800))",
            900: "hsl(var(--secondary-900))",
            950: "hsl(var(--secondary-950))",
          },
          accent: {
            50: "hsl(var(--accent-50))",
            100: "hsl(var(--accent-100))",
            200: "hsl(var(--accent-200))",
            300: "hsl(var(--accent-300))",
            400: "hsl(var(--accent-400))",
            500: "hsl(var(--accent-500))",
            600: "hsl(var(--accent-600))",
            700: "hsl(var(--accent-700))",
            800: "hsl(var(--accent-800))",
            900: "hsl(var(--accent-900))",
            950: "hsl(var(--accent-950))",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        gradient1: {
          DEFAULT: "var(--gradient1)",
        },
        gradient2: {
          DEFAULT: "var(--gradient2)",
        },
        gradient3: {
          DEFAULT: "var(--gradient3)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "rgba(244, 63, 94, 1)",
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

        linearPA: {
          DEFAULT: "var(--linearPA)",
          // foreground: "hsl(var(--linearPA-foreground))",
        },
        linearPS: {
          DEFAULT: "var(--linearPS)",
          // foreground: "hsl(var(--linearPB-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        default: "var(--radius)",
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
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        },
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",

        "accordion-up": "accordion-up 0.2s ease-out",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
