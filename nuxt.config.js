// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/icon', '@vueuse/nuxt', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],

  vite: {
      plugins: [
          tailwindcss(),
      ]
  },

  compatibilityDate: '2025-03-28',
})
