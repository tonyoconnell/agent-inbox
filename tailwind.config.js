export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          50: "#f0f7ff",
          100: "#e0f0ff",
          200: "#b8dfff",
          300: "#7cc5ff",
          400: "#36a7ff",
          500: "#0088ff",
          600: "#006fd4",
          700: "#0058ab",
          800: "#004a8c",
          900: "#003e73"
        }
      },
    },
  },
  plugins: [],
};
