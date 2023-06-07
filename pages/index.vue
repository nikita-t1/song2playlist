<template>
    <div class="flex flex-row h-screen">

        <div class="w-72 min-w-[18rem] bg-black flex flex-col justify-end p-4 border-1 border border-spotify-green ">
            <span class="text-white font-bold">Queue:</span>
            <Queue class="overflow-hidden overflow-y-scroll my-4"/>
            <Player/>
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

function fetchPlayback() {
    api.getPlaybackState().then(res => {
        // return if the response is not a track
        if (!isTrack(res.data.item)) return

        spotifyStore.setPlaybackState(res.data)
    }).catch(error => {
        console.log(error)
    });
}

</script>

<style scoped>

</style>
