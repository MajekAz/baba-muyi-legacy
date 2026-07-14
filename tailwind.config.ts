import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        archive: {
          ink: "#111827",
          navy: "#08131f",
          charcoal: "#151515",
          gold: "#c6a15b",
          cream: "#f7f1e4",
          paper: "#fffaf0",
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
