<script lang="ts" setup>
import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {storeToRefs} from "pinia";
import {PlaylistObjectSimplifiedWithTrack as Playlist} from "~/types/PlaylistObjectSimplifiedWithTrack";
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playbackState} = storeToRefs(spotifyStore)

const props = defineProps<{ playlist: Playlist }>()

const playlist_id = props.playlist.id

const spotify_uris = computed(() => [spotifyStore.playbackState?.item?.uri ?? ""].flat())

const image = computed(() => {
    if (!props.playlist) return ""
    if (!props.playlist.images) return ""
    return props.playlist.images[0]?.url ?? ""
})

const isCurrentTrackInPlaylist = computed(() => {
    const pbs = playbackState.value
    if (!pbs) return false
    // compare the current track id with the playlist tracks
    return props.playlist?.allTracks?.some((it: PlaylistTrackObject) => it.track?.id == pbs.item!.id) ?? false
})

onMounted(() => {
    spotifyStore.fetchPlaylistTracks(api, props.playlist)
})

function addTrackToPlaylist() {
    api.addTrackToPlaylist(playlist_id, spotify_uris.value)
        .finally(() => {
            spotifyStore.fetchPlaylistTracksAsync(api, props.playlist)
        })
}

function removeTrackToPlaylist() {
    api.deletePlaylistItem(playlist_id, spotify_uris.value)
        .finally(() => {
            spotifyStore.fetchPlaylistTracksAsync(api, props.playlist)
        })
}

// change the icon when hovering
const hover = ref(false)

</script>

<template>
    <div class="group">
        <div :class="isCurrentTrackInPlaylist ? 'bg-emerald-500 hover:bg-red-500' : 'bg-blue-500'"
             class="cursor-pointer w-8 h-8 absolute -m-2 text-center rounded-lg rounded-br-lg text-white duration-500"
             @mouseleave="hover = false" @mouseover="hover = true">
            <Icon v-if="isCurrentTrackInPlaylist" :name="hover ? 'bi:x' : 'bi:check-lg'" size="24"
                  @click="removeTrackToPlaylist"/>
            <Icon v-else name="bi:plus" size="24" @click="addTrackToPlaylist"/>
        </div>

        <img v-if="playlist"
             :class="{'outline outline-4 outline-spotify-green outline-offset-4': isCurrentTrackInPlaylist}"
             :src="image" alt="Playlist Image"
             class="h-48 w-48 rounded duration-300 group-hover:outline-none">
        <div class="mt-1 text-center text-white">{{ playlist.name }}</div>
    </div>
</template>