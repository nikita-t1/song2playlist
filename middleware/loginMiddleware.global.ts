import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {createPinia} from "pinia";
const spotifyStore = useSpotifyStore(createPinia())

export default defineNuxtRouteMiddleware(async (to, from) => {

    console.log("from: " + from.path)
    console.log("to: " + to.path)
    // if you are coming from the '/login' page, no evaluation is needed and the function returns here
    if (to.path.includes("login") || to.path.includes("callback") || from.path.includes("callback")) {
        return
    }

    try {
        await useSpotifyAPI(spotifyStore.spotifyToken).getUserProfile() // <-- will throw a 400 status code if the token is invalid or doesn't exist
        console.log("valid token")
        return navigateTo(to)
    } catch (e) {
        // redirect to '/login'
        return navigateTo('/login')
    }

})
