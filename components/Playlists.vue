<template>
    <div class="grow bg-spotify-black overflow-y-scroll pb-12">

        <div class="flex flex-wrap justify-evenly m-2 gap-y-4 gap-x-5">
            <div v-for="(playlist, index) in hiddenPlaylists" :class="showHidden ? '' : 'hidden'" :key="playlist.id"
                 class="w-48 items-center relative rounded-sm">
                <PlaylistCard :key="playlist.id" :playlist="playlist" @hideThis="toggleHiddenPlaylist"/>
            </div>
            <div v-for="(playlist, index) in unhiddenPlaylists" :class="showHidden ? 'hidden' : ''" :key="playlist.id" class="w-48 items-center relative rounded-sm">
                <PlaylistCard :key="playlist.id" :playlist="playlist" @hideThis="toggleHiddenPlaylist"/>
            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import type {
    PlaylistObjectSimplifiedWithTrack,
    PlaylistObjectSimplifiedWithTrack as Playlist
} from "~/types/PlaylistObjectSimplifiedWithTrack";
import {storeToRefs} from "pinia";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playlists} = storeToRefs(spotifyStore)

const props = defineProps<{ showHidden: Boolean }>()

const userPlaylists = computed<PlaylistObjectSimplifiedWithTrack[]>(() => {
    return playlists.value.filter((value: Playlist) => value.owner.id == (spotifyStore.spotifyUserProfile?.id ?? '') || value.collaborative)
})

const hiddenPlaylistIds = ref<string[]>([])

const hiddenPlaylists = computed<PlaylistObjectSimplifiedWithTrack[]>(() => {
    return userPlaylists.value.filter((value: Playlist) => hiddenPlaylistIds.value.includes(value.id))
})

const unhiddenPlaylists = computed<PlaylistObjectSimplifiedWithTrack[]>(() => {
    return userPlaylists.value.filter((value: Playlist) => !hiddenPlaylistIds.value.includes(value.id))
})

// const filteredPlaylists = computed(() => {
//     // only show hidden playlists
//     if (props.showHidden) {
//         return hiddenPlaylists.value
//     } else {
//         return userPlaylists.value.filter((value: Playlist) => !hiddenPlaylistIds.value.includes(value.id))
//     }
// })

function toggleHiddenPlaylist(playlist: Playlist) {
    if (hiddenPlaylistIds.value.includes(playlist.id)) {
        hiddenPlaylistIds.value = hiddenPlaylistIds.value.filter((value: string) => value != playlist.id)
    } else {
        hiddenPlaylistIds.value.push(playlist.id)
    }
}


</script>

