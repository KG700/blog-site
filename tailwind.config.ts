import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    container: {
      center: true,
    },
    colors: {
      "blog-blue": "#3F576F",
      "light-blue": "#a5f3fc",
      purple: "#8b5cf6",
      green: "#10b981",
      yellow: "#d9f99d",
      red: "#e11d48",
      white: "#ffffff",
    },
  },
  plugins: [typography],
};
export default config;
