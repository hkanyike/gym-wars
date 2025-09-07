import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0C",
        card: "#111113",
        text: "#FFFFFF",
        muted: "#9CA3AF",
        border: "#262626",
        accent: "#D1D5DB",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        pill: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
