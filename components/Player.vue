<template>
    <div class="flex flex-col">
        <img
            :src="[data?.album ? data.album.images[0].url : 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png']"
            alt="" class=" rounded-3xl border-spotify-green border">
        <span v-if="data" class="mt-4 text-white font-bold text-center">{{ data.name }}</span>
        <span class="text-neutral-500 text-center">{{ artists }}</span>
        <SeekBar />
        <PlaybackControls />
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {isTrack} from "~/utils/isTrack";
import PlaybackControls from "~/components/PlaybackControls.vue";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

let artists = ref("")

const data = useState<TrackObjectFull | null>()

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
    api.getPlaybackState().then(res => {
        // return if the response is not a track
        if (!isTrack(res.data.item)) return

        data.value = res.data.item
        spotifyStore.setPlaybackState(res.data)
        artists.value = res.data.item.artists.map((artist: any) => artist.name).join(', ')
    }).catch(error => {
        console.log(error)
    });
}

</script>

<style scoped>

</style>
