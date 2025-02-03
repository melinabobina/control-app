/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js, jsx, ts, tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        darkYellow: 'E4D292',
        lightYellow: 'F4E8D0',
        lightPurple: 'A493A8',
        medPurple: '47313E',
        darkPurple: '302A36',
        lightMauve: 'A26B70',
        medMauve: '875258',
        darkMauve: '6D3A41',
      },
      fontFamily:{
        pblack: ["Poppins-Black", "sans-serif"]
      },
    },
  },
  plugins: [],
}