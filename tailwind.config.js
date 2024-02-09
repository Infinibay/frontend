// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        web_dark: "#2D2D2D",
        web_lightwhite: "#FAFAFA",
        web_borderGray: "#DDD",
        web_grayblack: "#3F3F3F",
        web_darkgray: "#595959",
        web_lightgray: "#E9E9E9",
        web_lightbrown: "#EC9430",
        web_darkbrown: "#E08824",
        web_green: "#52C24A",
        web_lightBlue: "#1C77BF",
        web_darkBlue: "#16598E",
        web_aquablue: "#3BB3E1",
        // web_lightaqua:'#207EC3',
        web_red: "#FF0000",
        web_aquaBtnblue: "#1C74B9",
        web_lightGrey: "#E8E8E8",
        mweb_butnColor: "#207EC3",
        web_placeHolder: "#C1C1C1",
      },
      // fontFamily{
      //   oleo = ["--font-oleo"],
      // }
    },
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... } (Typical for 2k screens)

      "3xl": "1920px",
      // => @media (min-width: 1920px) { ... } (Typical for 1080p screens)

      "4xl": "2560px",
      // => @media (min-width: 2560px) { ... } (Typical for 1440p screens)

      "5xl": "3200px",
      // => @media (min-width: 3840px) { ... } (Typical for 4k screens)
    },
  },
  plugins: [nextui()],
};
