import type { Config } from "tailwindcss"
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D0D",
        gold: "#C9A96E",
        "gold-light": "#E8D5B0",
        cream: "#FAFAF8",
        "cream-2": "#F0EFEC",
        muted: "#8A8A8A",
        "site-border": "#E2E0DC",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}
export default config
