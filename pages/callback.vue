<template>
    <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
        <LoadingSpinner size="lg"/>
        <div class="text-white p-2">
            Getting Access Token from Spotify
        </div>
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI, {getSpotifyAccessToken} from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";

const spotifyStore = useSpotifyStore()
const authStore = useAuthorizationStore()

const authCode: string = useRoute().query.code?.toString() ?? ''
const state = useRoute().query.state
const error = useRoute().query.error

const authArgs = computed(() => {
    return {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: authStore.callbackUrl ?? '',
        client_id: authStore.clientId ?? '',
        code_verifier: authStore.codeVerifier ?? '',
    }
});

onMounted(() => {
    getSpotifyAccessToken(authArgs.value).then(spotifyResponse => {
        authStore.$patch({
            spotifyAccessToken: spotifyResponse.data.access_token,
            spotifyRefreshToken: spotifyResponse.data.refresh_token,
            spotifyTokenValidity: Date.now() + (spotifyResponse.data.expires_in * 1000),
        })

        const api = useSpotifyAPI(spotifyResponse.data.access_token)
        api.getUserProfile().then(userProfile => {
            spotifyStore.setSpotifyUserProfile(userProfile.data)
            navigateTo({path: "/"});
        })
    }).catch(e => {
        alert(e)
        console.log(e)
        navigateTo({path: "/login"});
    })
})

</script>
