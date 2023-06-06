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
            <div v-for="(val, index) in playlists" :key="index" class="w-48 items-center relative rounded">

                <div v-if="val.tracks" class="absolute">
                    <div v-if="isCurrentTrackInPlaylist(val)" @click.capture="removeTrackToPlaylist(val)">
                        <div
                            class="cursor-pointer w-8 h-8 bg-emerald-500 -m-2 text-center rounded-lg rounded-br-lg text-white hover:bg-red-500 group duration-500 ">
                            <Icon class="text-white group-hover:!hidden duration-500" name="bi:check-lg"
                                  size="24"></Icon>
                            <Icon class="!hidden group-hover:!inline-flex duration-500" name="bi:x" size="24"></Icon>
                        </div>
                    </div>
                    <div v-else @click.capture="addTrackToPlaylist(val)">
                        <div
                            class="cursor-pointer w-8 h-8 bg-blue-500 -m-2 text-center rounded-lg rounded-br-lg text-white">
                            <Icon class="text-white" name="bi:plus" size="24"></Icon>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="w-8 h-8 bg-red-500 absolute -m-2 text-center rounded-lg rounded-br-lg text-white">
                        <Icon name="bi:check-lg" size="24"></Icon>
                    </div>
                </div>
                <img v-if="val"
                     :class="{'outline outline-4 outline-spotify-green outline-offset-4': isCurrentTrackInPlaylist(val)}"
                     :src="val.images[0].url" alt=""
                     class="h-48 w-48 object-cover rounded duration-1000">
                <div class="mt-1 text-center text-white whitespace-normal">{{ val.name }}</div>
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
import {use} from "h3";
import {isCurrentPlayback} from "~/utils/isCurrentPlayback";

const spotifyStore = useSpotifyStore()

const api = useSpotifyAPI(spotifyStore.spotifyToken)

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

function addTrackToPlaylist(playlist: any) {
    const playlist_id = playlist.id
    const spotify_uris: any[] = [spotifyStore.playbackState?.item?.uri ?? ""].flat()
    api.addTrackToPlaylist(playlist_id, spotify_uris).then(() => {
        loadPlaylistTracks(playlist)
    })
}

function removeTrackToPlaylist(playlist: any) {
    const playlist_id = playlist.id
    const spotify_uris: any[] = [spotifyStore.playbackState?.item?.uri ?? ""].flat()
    api.deletePlaylistItem(playlist_id, spotify_uris).then(() => {
        loadPlaylistTracks(playlist)
    })
}

function isCurrentTrackInPlaylist(playlist: any) {
    const playback = spotifyStore.playbackState
    // check if the value is null,undefined,0,false,"",or NaN
    if (!playback) return []

    return playlist.allTracks.some((it: any) => it.track?.id == playback.item!.id)
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
