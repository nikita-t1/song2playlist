<template>
    <div class="text-neutral-500 mt-3">
        token_expires_in: {{ diffInSeconds }}
        <LoadingSpinner v-if="refresh" size="sm"/>
    </div>
</template>

<script lang="ts" setup>
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";
import useSpotifyAPI, {getSpotifyAccessToken} from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";

const authStore = useAuthorizationStore()
const spotifyStore = useSpotifyStore()

let intervalID: number
onMounted(() => {
    intervalID = window.setInterval(checkSpotifyToken, 1000)
})
onUnmounted(() => {
    window.clearInterval(intervalID)
})

const authArgs = computed(() => {
    return {
        grant_type: 'refresh_token',
        client_id: authStore.clientId ?? '',
        refresh_token: authStore.spotifyRefreshToken ?? '',
    }
});

const diffInSeconds = ref(0)
const refresh = ref(false)

function checkSpotifyToken() {
    if (refresh.value) return

    const date = new Date()
    const expiresIn: Date = new Date(authStore.spotifyTokenValidity)
    diffInSeconds.value = Math.round((expiresIn.getTime() - date.getTime()) / 1000);

    // If token expires in less than 5 minutes, refresh it
    if (diffInSeconds.value < (60 * 5)) {
        refreshToken()
    }
}

function refreshToken(){
    refresh.value = true
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
    }).finally(() => {
        refresh.value = false
    })
}

</script>
