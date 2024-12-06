/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        zero: "0px",
        min: "281px",
        "2min": "380px",
        min2: "400px",
        xs: "495px",
        "2xs": "541px",
        "3xs": "582px",
        sm: "640px",
        md: "768px",
        "2md": "912px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        background: {
          ground: "var(--surface-ground)",
          sections: "var(--surface-section)",
          card: "var(--surface-card)",
          overlay: "var(--surface-overlay)",
        },
        text: {
          primary: "var(--text-color)",
          secondary: "var(--text-color-secondary)",
          green: "var(--primary-color)",
        },
        fg: {
          primary: "var(--text-color)",
          secondary: "var(--text-color-secondary)",
          green: "var(--primary-color)",
        },
      },
    },
  },
  plugins: ["tailwind-children", require("tailwindcss-animated")],
};
