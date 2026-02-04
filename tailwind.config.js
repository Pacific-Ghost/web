/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{tsx,jsx}"],
  theme: {
    colors: {
      black: "#0D0D0D",
      white: "#FFFFFF",
      cream: "#F7F5F0",
      red: "#C41E3A",
      "red-dark": "#8B1428",
      gray: {
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', ...fontFamily.serif],
        body: ['"Inter"', ...fontFamily.sans],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 6vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
};
