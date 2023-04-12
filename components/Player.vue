<template>
    <div class="flex flex-col">
        <img
            :src="[data.album ? data.album.images[0].url : 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png']"
            alt="" class=" rounded-3xl border-spotify-green border border-2">
        <span v-if="data" class="mt-4 text-white font-bold text-center">{{ data.name }}</span>
        <span class="text-neutral-500 text-center">{{ artists }}</span>
        <div ref="progressBar" class="cursor-pointer duration-300 flex-none my-4 flex h-2 bg-gray-200 rounded-full"
             @click="seekToPosition">
            <div :aria-valuenow="playbackPercent" :style="{width: playbackPercent + '%'}" aria-valuemax="100"
                 aria-valuemin="0"
                 class="grow-0 duration-500  justify-center bg-spotify-green"
                 role="progressbar"></div>
        </div>
        <div class="inline-flex rounded-md shadow-sm w-full">
            <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="postPreviousTrack">
                        <Icon name="bi:skip-start-fill" size="20"/>
                    </span>
            </button>
            <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="togglePause">
                        <Icon v-if="isPlaying" name="bi:pause-fill" size="20"/>
                        <Icon v-else name="bi:caret-right-fill" size="20"/>
                    </span>
            </button>
            <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="postNextTrack">
                        <Icon name="bi:skip-end-fill" size="20"/>
                    </span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {useMouseInElement} from "@vueuse/core";
import {spotifyPlaybackState} from "~/composable/spotifyPlaybackState";
import {getPlaybackState, putPausePlayback, putResumePlayback, putSeekPosition, postNextTrack, postPreviousTrack} from "~/api/SpotifyAPI";

const progressBar = ref(null)
const {x, elementX, elementWidth} = useMouseInElement(progressBar)

let artists = ref("")
let isPlaying = ref(false)
let playbackPercent = ref(0.0)
let deviceId = ref("")
let progressMs = ref(0)
let durationMs = ref(0)

const data = ref({})

let interval = 0;
onMounted(() => {
    interval = window.setInterval(function () {
        fetchData();
    }, 3000)
})

onUnmounted(() => {
    clearInterval(interval)
})


function fetchData() {
    getPlaybackState().then(res => {
        data.value = res.data.item
        spotifyPlaybackState().value = res.data.item
        artists.value = res.data.item.artists.map((artist: any) => artist.name).join(', ')
        isPlaying.value = res.data.is_playing
        progressMs.value = res.data.progress_ms ? res.data.progress_ms : 1;
        durationMs.value = res.data.item.duration_ms ? res.data.item.duration_ms : 1;
        playbackPercent.value = progressMs.value / durationMs.value * 100
        deviceId.value = res.data.device.id
    }).catch(error => {
        console.log(error)
    });
}


function seekToPosition() {
    const requestedPercent = (elementX.value / elementWidth.value)
    const requestedPosition = Math.round(durationMs.value * requestedPercent)
    putSeekPosition(requestedPosition)
}


function togglePause() {
    if (isPlaying.value) {
        putPausePlayback()
    } else {
        putResumePlayback(deviceId.value)
    }
}
</script>

<style scoped>

</style>
