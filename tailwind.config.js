/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "alfanica-orange": "#FFB74D",
        "alfanica-green": "#66BB6A",
        "alfanica-blue": "#42A5F5",
        "alfanica-yellow": "#FFF176",
      },
      fontFamily: {
        kids: ['"Comic Neue"', '"Comic Sans MS"', "cursive"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
      },
    },
  },
  plugins: [],
};
