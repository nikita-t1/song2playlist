/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
        'node_modules/preline/dist/*.js',
    ],
    theme: {
        extend: {
            colors: {
                'spotify-green': '#1db954',
                'spotify-black': '#191414',
            },
        },
    },
    plugins: [
        require('preline/plugin'),
    ],
}
