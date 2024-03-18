import fs from 'fs'

export default defineNuxtConfig({
    devServer: process.env.TLS === 'y' ? {
        https: {
            cert: fs.readFileSync(process.env.TLS_CERT_FILE ?? '').toString(),
            key: fs.readFileSync(process.env.TLS_KEY_FILE ?? '').toString(),
        }
    }: {},

    devtools: {
        enabled: false
    },
    
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL
        }
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@on-247/nuxt-util'
    ],


    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
                // { rel: 'icon', type: 'image/png', href: '/favicon.png' },
                {rel: 'apple-touch-icon', sizes: "180x180", href: "/apple-touch-icon.png"},
            ]
        },
    },

    css: [
        '~/assets/css/app.scss'
    ]
})