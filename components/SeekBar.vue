<template>
    <div ref="progressBar" class="cursor-pointer duration-1000 my-4 flex h-2 bg-gray-200 rounded-lg"
         @click="seekToPosition">
        <div :aria-valuenow="playbackPercent" :style="{width: playbackPercent + '%'}" aria-valuemax="100"
             aria-valuemin="0"
             class="duration-1000 justify-center bg-spotify-green rounded-lg"
             role="progressbar">
        </div>
    </div>
</template>

<script lang="ts" setup>

import {useSpotifyStore} from "~/stores/useSpotifyStore";
import useSpotifyAPI from "~/api/SpotifyAPI";
import {storeToRefs} from "pinia";
import {useMouseInElement} from "@vueuse/core";

const progressBar = ref<HTMLDivElement | null>(null)
const {elementX, elementWidth} = useMouseInElement(progressBar)

const spotifyStore = useSpotifyStore()
const {playbackState} = storeToRefs(spotifyStore)

const progressMs = ref(0)
const durationMs = ref(0)

const playbackPercent = computed(() => {
    if (playbackState.value) {
        progressMs.value = playbackState.value.progress_ms ?? 0
        durationMs.value = playbackState.value.item?.duration_ms ?? 0
        return progressMs.value / durationMs.value * 100
    }
    return 0
})

function seekToPosition() {
    const requestedPercent = (elementX.value / elementWidth.value)
    const requestedPosition = Math.round(durationMs.value * requestedPercent)
    useSpotifyAPI().setSeekPosition(requestedPosition)
}


</script>
