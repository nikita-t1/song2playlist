<template>
    <div class="flex flex-row h-screen bg-spotify-black">
        <InitialProgressBar
            v-if="isInitialLoading"
            :total="spotifyStore.loadingProgress.total"
            :current="spotifyStore.loadingProgress.current"
            :message="spotifyStore.loadingProgress.message"
            :playlist-names="spotifyStore.loadingProgress.playlistNames"
        />

        <div class="w-72 min-w-[18rem] bg-black flex flex-col justify-end p-3 pt-0 border-1 border border-spotify-green ">
            <Queue class="mb-4"/>
            <Player :isFetching="isFetchingPlayback"/>
            <SpotifyTokenValidity class="text-center"/>
        </div>
        <div class="flex flex-col w-full ">
            <Header class="p-4" :showHidden="viewHiddenPlaylists" />
            <Playlists :loading="isFetchingPlaylists" :showHidden="viewHiddenPlaylists"/>
        </div>
        <PlaylistSongsSidebar />


    </div>
</template>

<script lang="ts" setup>

import {isTrack} from "~/utils/isTrack";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import useSpotifyAPI from "~/api/SpotifyAPI";
import {provide, ref} from "vue";
import type {PlaylistObjectSimplifiedWithTrack} from "~/types/PlaylistObjectSimplifiedWithTrack";
type PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const isInitialLoading = ref(true)

let interval = 0;
onMounted(async () => {
    await fetchInitialData()
    interval = window.setInterval(fetchPlayback, 5000)
})
onUnmounted(() => {
    clearInterval(interval)
})

const isFetchingPlayback = ref(false)
const isFetchingPlaylists = ref(false)

async function fetchInitialData() {
    isInitialLoading.value = true
    spotifyStore.updateLoadingProgress(0, 100, 'Fetching user profile...')

    try {
        await fetchUserProfile()
        spotifyStore.updateLoadingProgress(10, 100, 'Fetching playlists...')

        const playlists = await api.getAllUserPlaylists()
        spotifyStore.setPlaylists(playlists as PlaylistObjectSimplifiedWithTrack[])

        const userPlaylists = playlists.filter((value: any) => value.owner.id == (spotifyStore.spotifyUserProfile?.id ?? '') || value.collaborative)

        const total = userPlaylists.length
        spotifyStore.updateLoadingProgress(20, total + 20, `Found ${total} playlists. Fetching tracks...`)

        // Fetch tracks for each playlist in chunks of 5 to speed up but still show progress
        const CHUNK_SIZE = 5
        for (let i = 0; i < userPlaylists.length; i += CHUNK_SIZE) {
            const chunk = userPlaylists.slice(i, i + CHUNK_SIZE)
            const playlistNames = chunk.map(playlist => playlist.name)
            spotifyStore.updateLoadingProgress(i + 20, total + 20, `Loading tracks for ${i + 1}-${Math.min(i + CHUNK_SIZE, total)} of ${total} playlists...`, playlistNames)
            await Promise.all(chunk.map(playlist => spotifyStore.fetchPlaylistTracksAsync(api, playlist as PlaylistObjectSimplifiedWithTrack)))
        }

        spotifyStore.updateLoadingProgress(total + 20, total + 20, 'Done!')
    } catch (error) {
        console.error('Failed to fetch initial data:', error)
    } finally {
        isInitialLoading.value = false
    }
}

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
        spotifyStore.setPlaylists(pos as PlaylistObjectSimplifiedWithTrack[])
    }).finally(() => {
        isFetchingPlaylists.value = false
    })
}
provide('fetchPlaylists', fetchPlaylists)

async function fetchUserProfile() {
    const userProfile = await api.getUserProfile();
    spotifyStore.setSpotifyUserProfile(userProfile.data);
}

const viewHiddenPlaylists = ref(false)
function setViewHiddenPlaylists(){
    viewHiddenPlaylists.value = !viewHiddenPlaylists.value
    return viewHiddenPlaylists.value
}
provide('setViewHiddenPlaylists', setViewHiddenPlaylists)

</script>
