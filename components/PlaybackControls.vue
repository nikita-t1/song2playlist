<script setup lang="ts">
import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {storeToRefs} from "pinia";

const api = useSpotifyAPI()
const spotifyStore = useSpotifyStore()
const {playbackState} = storeToRefs(spotifyStore)

function togglePause() {
    if (!playbackState.value) return
    if (playbackState.value.is_playing) {
        api.pausePlayback()
    } else {
        api.resumePlayback(playbackState.value.device.id ?? "")
    }
}
</script>

<template>
    <div class="inline-flex rounded-md shadow-sm w-full">
        <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="api.skipToPreviousTrack">
                        <Icon name="bi:skip-start-fill" size="20"/>
                    </span>
        </button>
        <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="togglePause">
                        <Icon v-if="playbackState?.is_playing" name="bi:pause-fill" size="20"/>
                        <Icon v-else name="bi:caret-right-fill" size="20"/>
                    </span>
        </button>
        <button class="grow text-white cursor-auto" type="button">
                    <span
                        class="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-green-100 text-green-500 cursor-pointer"
                        @click="api.skipToNextTrack">
                        <Icon name="bi:skip-end-fill" size="20"/>
                    </span>
        </button>
    </div>
</template>

<style scoped>

</style>
