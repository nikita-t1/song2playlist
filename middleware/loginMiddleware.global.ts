import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {createPinia} from "pinia";
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthorizationStore(createPinia())

    console.log("from: " + from.path)
    console.log("to: " + to.path)
    // if you are coming from the '/login' page, no evaluation is needed and the function returns here
    if (to.path.includes("login") || to.path.includes("callback") || from.path.includes("callback")) {
        return
    }

    if (authStore.spotifyTokenValidity < Date.now()) {
        // redirect to '/login'
        return navigateTo('/login')
    }
})
