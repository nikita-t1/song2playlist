// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    modules: ['nuxt-icon', '@vueuse/nuxt', '@pinia/nuxt',],
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})
