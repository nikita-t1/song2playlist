<template>
    <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
        <LoadingSpinner size="lg" />
        <div class="text-white">
            Getting Access Token from Spotify
        </div>
    </div>
</template>

<script lang="ts" setup>

import axios from "axios";

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";

const spotifyStore = useSpotifyStore()

const authCode = useRoute().query.code
const state = useRoute().query.state
const error = useRoute().query.error

onMounted(() => {
    if (error == null) {
        axios.get("/api/callback", {
            params: {
                authCode: authCode,
                state: state,
            }
        }).then(async spotifyResponse => {
            spotifyStore.$patch({
                spotifyToken: spotifyResponse.data.access_token,
                spotifyRefreshToken: spotifyResponse.data.refresh_token,
                spotifyTokenValidity: Date.now() + (spotifyResponse.data.expires_in * 1000),
            })
            const api = useSpotifyAPI(spotifyResponse.data.access_token)
            const userProfile = (await api.getUserProfile()).data
            spotifyStore.setSpotifyUserProfile(userProfile)
            navigateTo({path: "/"});
        }).catch(e => {
            alert(e)
            console.log(e)
            navigateTo({path: "/login"});
        })

    } else {
        console.log(error)
    }

})

</script>

<style scoped>

</style>
