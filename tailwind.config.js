/** @type {import('tailwindcss').Config} */

import {fontFamily} from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{tsx,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        brand: [...fontFamily.serif]
      }
    },
  },
  plugins: [],
}

