module.exports = {
  content: ["./{src,app,pages}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-primary": "#2e026d",
        "custom-primary-dark": "#15162c",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
