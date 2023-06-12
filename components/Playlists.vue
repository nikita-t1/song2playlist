<template>
    <div class="grow bg-spotify-black overflow-y-scroll pb-12">

        <div class="flex justify-end items-center m-4">
            <button class="bg-emerald-500 rounded p-2 px-4 mx-4 justify-center text-center" type="button"
                    @click.capture="reloadPlaylists">
                Reload Playlists
                <Icon class="ml-2" name="bi:arrow-repeat" size="20"/>
            </button>
        </div>

        <div v-if="loading" class="flex flex-col justify-center items-center h-screen">
            <LoadingSpinner size="lg"/>
        </div>

        <div v-else class="flex flex-wrap justify-evenly m-2 gap-y-4 gap-x-5">
            <div v-for="(playlist, index) in filteredPlaylists" :key="index" class="w-48 items-center relative rounded">
                <PlaylistCard :playlist="playlist" />
            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, provide } from 'vue'

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import DevButton from "~/components/DevButton.vue";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import {PlaylistObjectSimplifiedWithTrack as Playlist} from "~/types/PlaylistObjectSimplifiedWithTrack";
import {storeToRefs} from "pinia";

const loading = ref(false)

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playlists} = storeToRefs(spotifyStore)
const playlistsChanged = ref(false)
watch(playlists, () => {
    playlistsChanged.value = true
    setTimeout(() => playlistsChanged.value = false, 1000)
}, {deep: true})

onMounted(() => fetchPlaylists())

const filteredPlaylists = computed(() => {
    return playlists.value.filter((value: Playlist) => value.owner.id == (spotifyStore.spotifyUserProfile?.id ?? ''))
})

provide('fetchPlaylists', fetchPlaylists)
function fetchPlaylists() {
    loading.value = true
    api.getAllUserPlaylists().then(async (pos: PlaylistObjectSimplified[]) => {
        const poswt = pos as Playlist[]
        // for (const playlist of poswt) {
        //     // await spotifyStore.fetchPlaylistTracksAsync(api, playlist)
        //     spotifyStore.fetchPlaylistTracks(api, playlist)
        // }
        spotifyStore.setPlaylists(poswt)
    }).finally(() => {
        loading.value = false
    })
}

// async function fetchPlaylistTracks(playlist: Playlist) {
//     playlist.allTracks = await api.getAllPlaylistTracks(playlist.tracks.href);
// }

</script>

