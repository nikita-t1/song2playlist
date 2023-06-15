<template>
    <div class="grow bg-spotify-black overflow-y-scroll pb-12">

        <div class="flex flex-wrap justify-evenly m-2 gap-y-4 gap-x-5">
            <div v-for="(playlist, index) in filteredPlaylists" :key="index" class="w-48 items-center relative rounded">
                <PlaylistCard :playlist="playlist" />
            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {PlaylistObjectSimplifiedWithTrack as Playlist} from "~/types/PlaylistObjectSimplifiedWithTrack";
import {storeToRefs} from "pinia";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playlists} = storeToRefs(spotifyStore)

const filteredPlaylists = computed(() => {
    return playlists.value.filter((value: Playlist) => value.owner.id == (spotifyStore.spotifyUserProfile?.id ?? ''))
})


</script>

