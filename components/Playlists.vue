<template>
    <div class="grow bg-spotify-black overflow-y-scroll pb-12">
        <div class="flex justify-end items-center m-4">
            <button class="bg-emerald-500 rounded p-2 px-4 mx-4 justify-center text-center" type="button"
                    @click.capture="reloadPlaylists">
                Reload Playlists
                <Icon class="ml-2" name="bi:arrow-repeat" size="20"/>
            </button>
        </div>
        <div v-if="actualPlaylistsSize < expectedPlaylistsSize"
             class="flex flex-wrap justify-center justify-items-center justify-self-center text-white">
            <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
                <div
                    aria-label="loading"
                    class="m-4 animate-spin inline-block w-24 h-24 border-[6px] border-current border-t-transparent text-spotify-green rounded-full"
                    role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <div class="text-white">
                    {{ actualPlaylistsSize }}/{{ expectedPlaylistsSize }}
                </div>
            </div>
        </div>
        <div v-else class="flex flex-wrap justify-start justify-items-center justify-self-center space-y-4 space-x-5">

            <div></div>
            <div v-for="(playlist, index) in playlists" :key="index" class="w-48 items-center relative rounded">

                <PlaylistCard :playlist="playlist" @reloadPlaylistTracks="loadPlaylistTracks(playlist)" />

            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import {ref, Ref} from '@vue/reactivity'
import {onBeforeMount} from "@vue/runtime-core";
import useSpotifyAPI from "~/api/SpotifyAPI";

import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {isUserObject} from "~/utils/isUserObject";

const spotifyStore = useSpotifyStore()

const api = useSpotifyAPI()

const playlists: Ref<any[]> = ref([])
const expectedPlaylistsSize = ref(Number.MAX_SAFE_INTEGER)
const actualPlaylistsSize = ref(0)

onBeforeMount(() => {
    loadAllUserPlaylists()
})

function loadAllUserPlaylists() {
    api.getAllUserPlaylists().then(async (playlists: any[]) => {

        const userProfiles = spotifyStore.spotifyUserProfile
        if (!isUserObject(userProfiles)) return

        // show only user playlists
        playlists = playlists.filter((value: any) => value.owner.id == userProfiles.id)


        mapPlaylistImages(playlists)
        expectedPlaylistsSize.value = playlists.length
        for (const playlist of playlists) {
            loadPlaylistTracks(playlist).then(value => {
                actualPlaylistsSize.value = actualPlaylistsSize.value + 1
            })
            // await sleep(1000)
        }
    })
}

function mapPlaylistImages(pl: any[]) {
    playlists.value = pl.map((element: any) => {
        if (element.images[0] == undefined) {
            element.images[0] = {"url": "https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png"}
        }
        return element
    })
}

async function loadPlaylistTracks(playlist: any) { //PlaylistObjectFull
    playlist.allTracks = await api.getAllPlaylistTracks(playlist.tracks.href);
    console.log(playlist.allTracks)

}

function reloadPlaylists() {
    actualPlaylistsSize.value = 0
    loadAllUserPlaylists()
}

</script>

<style scoped>

</style>
