/** @type {import('tailwindcss').Config} */

import {fontFamily} from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{tsx,jsx}"],
  theme: {
    colors: {
      primary: "#2a07bf",
      background : "#ffd2c0",
    },
    lineHeight: {
      '2': '.5rem'
    },
    extend: {
      fontFamily: {
        brand: ['Flared', ...fontFamily.sans],
        sans: ['Roboto', ...fontFamily.sans]
      }
    },
  },
  plugins: [],
}

