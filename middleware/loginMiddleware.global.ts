import {getUserProfile} from "~/api/getUserProfile";

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log(from.path)

    // if you are coming from the '/login' page, no evaluation is needed and the function returns here
    if (from.path == '/login' || from.path == '/callback/') {
        return
    }

    try {
        await getUserProfile() // <-- will throw a 400 status code if the token is invalid or doesn't exist
        return navigateTo(to)
    } catch (e) {
        // redirect to '/login'
        return navigateTo('/login')
    }

})
