import type { Config } from "tailwindcss"

import svgToDataUri from "mini-svg-data-uri"
import { fontFamily } from "tailwindcss/defaultTheme"

import type { PluginAPI } from "tailwindcss/types/config"

function addVariablesForColors({
  addBase,
  theme,
}: {
  addBase: any
  theme: PluginAPI["theme"]
}) {
  const allColors = flattenColorPalette(theme("colors"))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ":root": newVars,
  })
}
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
        "3xl": "2560px",
      },
    },
    scale3d: {
      0: "0,0,0",
    },
    translate3d: {
      0: "0,0,0",
    },
    "transform-style": { inherit: "inherit" },

    extend: {
      perspective: {
        0: "0px",
        1: "1px",
      },

      "translate-z": {
        0: "0px",
        1: "1px",
      },
      height: {
        inherit: "inherit",
      },
      width: {
        inherit: "inherit",
      },
      color: {
        inherit: "inherit",
      },
      "transform-style": { inherit: "inherit" },
      "border-t": {
        1: "1px",
      },
      "border-b": {
        1: "1px",
      },
      "border-l": {
        1: "1px",
      },
      "border-r": {
        1: "1px",
      },
      h: {
        toolbar: "56px",
        app: "calc(100vh - 56px)",
        vh: "100h",
      },
      leading: {
        0: "0",
      },

      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
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
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-3d"),
    addVariablesForColors,

    ({ matchUtilities, theme }: any) => {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url('${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${value}'><path d='M0 .5H31.5V32'/></svg>`
            )}')`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url('${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='8' height='8' fill='none' stroke='${value}'><path d='M0 .5H31.5V32'/></svg>`
            )}')`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url('${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'><circle fill='${value}' id='pattern-circle' cx='10' cy='10' r='1.6257413380501518'></circle></svg>`
            )}')`,
          }),
          "bg-dot-thick": (value: any) => ({
            backgroundImage: `url('${svgToDataUri(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'><circle fill='${value}' id='pattern-circle' cx='10' cy='10' r='2.5'></circle></svg>`
            )}')`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      )
    },
    ({
      matchUtilities,
      theme,
    }: {
      matchUtilities: PluginAPI["matchUtilities"]
      theme: PluginAPI["theme"]
    }) => {
      matchUtilities(
        {
          translate3d: (value: string) => ({
            transform: `translate3d(${value})`,
          }),
          "cols-template": (value: string) => ({
            "grid-template-columns": value,
          }),
          "row-template": (value: string) => ({
            "grid-template-rows": value,
          }),
          "max-font": (value: string) => {
            return {
              "font-size": `clamp(100%, 1rem + ${value})`,
            }
          },
        },
        { values: theme("app") }
      )
    },
  ],
}
export default config
