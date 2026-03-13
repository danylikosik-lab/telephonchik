/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0e071b",
        backgroundSoft: "#1a0f2b",
        accent: "#9b5bff",
        accentSoft: "#b37aff",
        accentStrong: "#ffdf40",
        textPrimary: "#ffffff",
        textSecondary: "#b9a9d9",
        danger: "#ff4b81",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        card: "0 18px 40px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

