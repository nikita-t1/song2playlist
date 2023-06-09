<template>
    <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between my-2">
            <span class="text-white font-bold">Player:</span>
            <LoadingSpinner v-if="isFetching" size="sm"/>
        </div>
        <img :src=imageUrl alt="" class=" rounded-3xl border-spotify-green border">
        <span class="mt-4 text-white font-bold text-center">{{ title }}</span>
        <span class="text-neutral-500 text-center">{{ artists }}</span>
        <SeekBar/>
        <PlaybackControls/>
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {isTrack} from "~/utils/isTrack";
import {storeToRefs} from "pinia";

const api = useSpotifyAPI()
const spotifyStore = useSpotifyStore()
const {playbackState} = storeToRefs(spotifyStore)

defineProps<{ isFetching: boolean }>()


const fallbackImage = 'https://developer.spotify.com/images/guidelines/design/icon3@2x.png'

const title = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.name
})

const artists = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.artists.map((artist: any) => artist.name).join(', ')
})

const imageUrl = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return fallbackImage
    return playbackState.value.item.album.images[0].url
})

</script>

<style scoped>

</style>
