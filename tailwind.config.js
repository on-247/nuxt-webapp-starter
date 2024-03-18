/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}"
    ],
    theme: {
        fontFamily: {
            sans: ['apfelGrotezk', 'sans-serif']
        },
        extend: {
            colors: {
                gray: '#555555',
                lightGray: '#D9D9D9',
                success: '#92FF5F',
                danger: '#FF8080',
                paused: '#FF8A00',
            },
            fontSize: {
                // namespace 'od'
                ttxs: '0.1rem',
                ttsm: '1.2rem',
                ttbase: '1.44rem',
                ttlg: '1.728rem',
                ttxl: '2.0736rem',
                tt2xl: '2.48832rem',
                tt3xl: '2.985984rem',
                tt4xl: '3.5831808rem',
            }
        }
    },
    plugins: [],
}