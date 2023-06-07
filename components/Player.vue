<template>
    <div class="flex flex-col">
        <img
            :src="[data?.album ? data.album.images[0].url : 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png']"
            alt="" class=" rounded-3xl border-spotify-green border">
        <span v-if="data" class="mt-4 text-white font-bold text-center">{{ data.name }}</span>
        <span class="text-neutral-500 text-center">{{ artists }}</span>
        <SeekBar />
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
                        <Icon v-if="isPlaying" name="bi:pause-fill" size="20"/>
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
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {isTrack} from "~/utils/isTrack";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

let artists = ref("")
let isPlaying = ref(false)
let deviceId = ref("")

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
        isPlaying.value = res.data.is_playing
        deviceId.value = res.data.device.id ?? ""
    }).catch(error => {
        console.log(error)
    });
}



function togglePause() {
    if (isPlaying.value) {
        api.pausePlayback()
    } else {
        api.resumePlayback(deviceId.value)
    }
}
</script>

<style scoped>

</style>
