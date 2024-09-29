// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    modules: ['@nuxt/icon', '@vueuse/nuxt', '@pinia/nuxt', 'nuxt-primevue'],
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    primevue: {
        unstyled: true
    },
})
