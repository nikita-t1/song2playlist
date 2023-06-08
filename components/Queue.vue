<template>
    <div>
        <div class="flex flex-row items-center justify-between me-2">
            <span class="text-white font-bold">Queue:</span>
            <LoadingSpinner v-if="isFetching"/>
        </div>

        <ul class="flex flex-col">
            <li v-for="(item, index) in queue" :key="index" class="py-3 px-2 text-sm text-white border-b">
                <div class="inline-flex flex-row items-center">
                    <img :src="item.album.images.at(0).url" alt=""
                         class="w-12 rounded border-spotify-green border border-transparent border-1">
                    <div class="flex flex-col ml-2">
                        <div class="text-white font-bold">{{ item.name }}</div>
                        <div class="text-neutral-500">{{ convertArtistsToReadableFormat(item.artists) }}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {isTrack} from "~/utils/isTrack";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import ArtistObjectSimplified = SpotifyApi.ArtistObjectSimplified;
import {Ref} from "vue";

const isFetching = ref(false)
const queue: Ref<TrackObjectFull[] | null> = ref(null)

let interval = 0;
onMounted(() => {
    interval = window.setInterval(() => fetchQueue(), 5000)
})
onUnmounted(() => {
    clearInterval(interval)
})

function fetchQueue() {
    isFetching.value = true
    useSpotifyAPI().getQueue().then(res => {
        queue.value = res.data.queue.filter(item => isTrack(item)) as TrackObjectFull[]
    }).catch(err => {
        console.log(err)
        queue.value = null
    }).finally(() => {
        isFetching.value = false
    });
}

function convertArtistsToReadableFormat(artists: Array<ArtistObjectSimplified>) {
    return artists.map((artist: ArtistObjectSimplified) => artist.name).join(', ')
}

</script>

<style scoped>

</style>
