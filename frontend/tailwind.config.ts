import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arm: {
          900: "#0a0f1e",
          800: "#0d1526",
          700: "#111e33",
          600: "#162440",
        },
      },
    },
  },
  plugins: [],
};

export default config;
