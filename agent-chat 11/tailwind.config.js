/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E0EDE4",
        secondary: "#83AF8C",
        textprimarycolor:"#666ee2",
        textsecondarycolor: "#5058e5",
        card: "#dfe1f1",
        "normal-button": "#526bcc",
        "hover-button": '#5058e5',
        "active-button": '#000070',
        textColor: '#666ee2',
        navBg: '#e0e0e0',
        selectedItemBG: '#d5d8f2',
        pageBg: '#f5f5f5',
        navHover: '#d5d8f2'
      },
      boxShadow: {'custom': '0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 6px rgba(0, 0, 0, 0.1), 4px 0 6px rgba(0, 0, 0, 0.1), -4px 0 6px rgba(0, 0, 0, 0.1)', },
      fontFamily: {
        'noto-sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-justify': {
          'text-align': 'justify',
        },
      });
    },
  ],
}
