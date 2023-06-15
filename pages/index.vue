<template>
    <div class="flex flex-row h-screen">

        <div
            class="w-72 min-w-[18rem] bg-black flex flex-col justify-end p-3 pt-0 border-1 border border-spotify-green ">
            <Queue class="mb-4"/>
            <Player :isFetching="isFetchingPlayback"/>
            <SpotifyTokenValidity class="text-center"/>
        </div>
        <div class="flex flex-col w-full">
            <div class="flex justify-end items-center p-4 bg-spotify-black ">
                <LoadingSpinner v-if="playlistsChanged" size="md" class="mx-4"/>
                <Header />
            </div>
            <Playlists :loading="isFetchingPlaylists"/>
        </div>

    </div>
</template>

<script lang="ts" setup>

import {isTrack} from "~/utils/isTrack";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import useSpotifyAPI from "~/api/SpotifyAPI";
import {storeToRefs} from "pinia";
import {provide, ref} from "vue";
import {PlaylistObjectSimplifiedWithTrack as Playlist} from "~/types/PlaylistObjectSimplifiedWithTrack";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playlists} = storeToRefs(spotifyStore)
const playlistsChanged = ref(false)
watch(playlists, () => {
    playlistsChanged.value = true
    setTimeout(() => playlistsChanged.value = false, 1000)
}, {deep: true})

let interval = 0;
onMounted(() => {
    fetchPlaylists()
    interval = window.setInterval(fetchPlayback, 3000)
})
onUnmounted(() => {
    clearInterval(interval)
})

const isFetchingPlayback = ref(false)
const isFetchingPlaylists = ref(false)

function fetchPlayback() {
    isFetchingPlayback.value = true

    if (spotifyStore.spotifyUserProfile?.id == undefined) {
        fetchUserProfile()
    }

    api.getPlaybackState().then(res => {
        // return if the response is not a track
        if (!isTrack(res.data.item)) return

        spotifyStore.setPlaybackState(res.data)
    }).catch(error => {
        if (error != "TypeError: track is undefined") { // happens if no track is playing for some time
            console.log(error)
        }
    }).finally(() => {
        isFetchingPlayback.value = false
    });
}

function fetchPlaylists() {
    isFetchingPlaylists.value = true
    api.getAllUserPlaylists().then((pos: PlaylistObjectSimplified[]) => {
        spotifyStore.setPlaylists(pos as Playlist[])
    }).finally(() => {
        isFetchingPlaylists.value = false
    })
}
provide('fetchPlaylists', fetchPlaylists)

function fetchUserProfile() {
    api.getUserProfile().then(userProfile => {
        spotifyStore.setSpotifyUserProfile(userProfile.data)
    })
}

</script>
