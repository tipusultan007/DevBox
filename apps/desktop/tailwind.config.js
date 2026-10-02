/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        devbox: {
          bg: "#0B0F19",
          card: "#111827",
          panel: "#161F30",
          border: "#1F293D",
          hover: "#243048",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          accent: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          purple: "#8B5CF6",
          text: "#F3F4F6",
          muted: "#94A3B8",
          subtle: "#64748B",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(59, 130, 246, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }
    },
  },
  plugins: [],
}
