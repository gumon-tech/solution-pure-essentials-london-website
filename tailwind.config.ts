import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2EA",
        linen: "#F3EDE3",
        sand: "#EDE4D6",
        beige: "#E3D6C3",
        espresso: "#2B2420",
        cocoa: "#4A3F35",
        walnut: "#6B5A4A",
        oak: "#8A6A4E",
        wood: "#A67B5B"
      },
      boxShadow: {
        soft: "0 2px 8px rgba(43,36,32,0.06)"
      },
      borderRadius: {
        arch: "999px 999px 8px 8px"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
