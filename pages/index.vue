<template>
    <div class="flex flex-row h-screen">

        <div class="w-72 min-w-[18rem] bg-black flex flex-col justify-end p-3 pt-0 border-1 border border-spotify-green ">
            <Queue class="mb-4"/>
            <Player :isFetching="isFetching"/>
            <SpotifyTokenValidity class="text-center"/>
        </div>

        <Playlists/>


    </div>


</template>

<script lang="ts" setup>

import {isTrack} from "~/utils/isTrack";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import useSpotifyAPI from "~/api/SpotifyAPI";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

let interval = 0;
onMounted(() => {
    interval = window.setInterval(() => {
        fetchPlayback();
    }, 3000)
})
onUnmounted(() => {
    clearInterval(interval)
})

const isFetching = ref(false)

function fetchPlayback() {
    isFetching.value = true
    api.getPlaybackState().then(res => {
        // return if the response is not a track
        if (!isTrack(res.data.item)) return

        spotifyStore.setPlaybackState(res.data)
    }).catch(error => {
        console.log(error)
    }).finally(() => {
        isFetching.value = false
    });
}

</script>

<style scoped>

</style>
