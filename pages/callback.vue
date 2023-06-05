<template>
    <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
        <div class="m-4 animate-spin inline-block w-24 h-24 border-[6px] border-current border-t-transparent text-spotify-green rounded-full" role="status" aria-label="loading">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="text-white">
            Getting Access Token from Spotify
        </div>
    </div>
</template>

<script setup lang="ts">

import {spotifyToken} from "~/composable/spotifyToken";
import {spotifyTokenValidity} from "~/composable/spotifyTokenValidity";
import {spotifyRefreshToken} from "~/composable/spotifyRefreshToken";
import {spotifyUserProfile} from "~/composable/spotifyUserProfile";
import axios from "axios";
import useSpotifyAPI from "~/api/SpotifyAPI";

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
            spotifyToken().value = spotifyResponse.data.access_token
            spotifyRefreshToken().value = spotifyResponse.data.refresh_token
            spotifyTokenValidity().value = Date.now() + (spotifyResponse.data.expires_in * 1000)
            const api = useSpotifyAPI(spotifyToken().value)
            console.log(api)
            spotifyUserProfile().value = (await api.getUserProfile()).data
            navigateTo({path: "/"});
        }).catch(e => {
            alert(e)
            console.log(e)
            navigateTo({ path: "/login" });
        })

    } else {
        console.log(error)
    }

})

</script>

<style scoped>

</style>
