/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      aspectRatio: {
        '12/5': '12 / 5',
      },
      width: {
        128: '32rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
