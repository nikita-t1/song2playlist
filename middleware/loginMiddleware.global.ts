import SpotifyAPI from "~/api/SpotifyAPI";
import useSpotifyAPI from "~/api/SpotifyAPI";
import {spotifyToken} from "~/composable/spotifyToken";

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log(from.path)

    // if you are coming from the '/login' page, no evaluation is needed and the function returns here
    if (from.path == '/login' || from.path == '/callback/') {
        return
    }

    try {
        await useSpotifyAPI(spotifyToken().value).getUserProfile() // <-- will throw a 400 status code if the token is invalid or doesn't exist
        return navigateTo(to)
    } catch (e) {
        // redirect to '/login'
        return navigateTo('/login')
    }

})
