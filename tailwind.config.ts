import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        heritage: {
          navy: "#0B1D33"
        },
        legacy: {
          gold: "#D4AF37"
        },
        ink: {
          charcoal: "#1A1A1A"
        },
        silver: {
          grey: "#8C8C8C"
        },
        archive: {
          ink: "#1A1A1A",
          navy: "#0B1D33",
          charcoal: "#1A1A1A",
          gold: "#D4AF37",
          cream: "#F7F4EC",
          paper: "#F7F4EC",
          ivory: "#F7F4EC",
          stone: "#D9D2C4",
          grey: "#8C8C8C",
          brown: "#6c4b2a",
          moss: "#556b4d"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        museum: "0 24px 80px rgba(8, 19, 31, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
