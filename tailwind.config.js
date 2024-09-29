/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                'spotify-green': '#1db954',
                'spotify-green-lighter': '#22df65',
                'spotify-green-lightest': '#27ff73',
                'spotify-green-darker': '#27ff73',
                'spotify-green-darkest': '#116c31',
                'spotify-black': '#191414',
            },
        },
    },
}
