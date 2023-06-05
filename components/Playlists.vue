<template>
    <div class="grow bg-spotify-black overflow-y-scroll pb-12">
        <div class="flex justify-end items-center m-4">
            <button class="bg-emerald-500 rounded p-2 px-4 mx-4 justify-center text-center" type="button" @click.capture="reloadPlaylists">
                Reload Playlists
                <Icon class="ml-2" name="bi:arrow-repeat" size="20" />
            </button>
        </div>
        <div v-if="actualPlaylistsSize < expectedPlaylistsSize" class="flex flex-wrap justify-center justify-items-center justify-self-center text-white">
            <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
                <div class="m-4 animate-spin inline-block w-24 h-24 border-[6px] border-current border-t-transparent text-spotify-green rounded-full" role="status" aria-label="loading">
                    <span class="sr-only">Loading...</span>
                </div>
                <div class="text-white">
                    {{actualPlaylistsSize}}/{{expectedPlaylistsSize}}
                </div>
            </div>
        </div>
        <div v-else class="flex flex-wrap justify-start justify-items-center justify-self-center space-y-4 space-x-5">

            <div></div>
            <div v-for="(val, index) in playlists" class="w-48 items-center relative rounded" :key="index">

                <div v-if="val.tracks" class="absolute" >
                    <div v-if="isCurrentTrackInPlaylist(val)" @click.capture="removeTrackToPlaylist(val)">
                        <div class="cursor-pointer w-8 h-8 bg-emerald-500 -m-2 text-center rounded-lg rounded-br-lg text-white hover:bg-red-500 group duration-500 ">
                            <Icon name="bi:check-lg" size="24" class="text-white group-hover:!hidden duration-500"></Icon>
                            <Icon class="!hidden group-hover:!inline-flex duration-500" name="bi:x" size="24"  ></Icon>
                        </div>
                    </div>
                    <div v-else @click.capture="addTrackToPlaylist(val)">
                        <div class="cursor-pointer w-8 h-8 bg-blue-500 -m-2 text-center rounded-lg rounded-br-lg text-white">
                            <Icon name="bi:plus" size="24" class="text-white"></Icon>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="w-8 h-8 bg-red-500 absolute -m-2 text-center rounded-lg rounded-br-lg text-white">
                        <Icon name="bi:check-lg" size="24"></Icon>
                    </div>
                </div>
                <img v-if="val" :src="val.images[0].url" alt="" class="h-48 w-48 object-cover rounded duration-1000" :class="{'outline outline-4 outline-spotify-green outline-offset-4': isCurrentTrackInPlaylist(val)}">
                <div class="mt-1 text-center text-white whitespace-normal">{{ val.name }}</div>
            </div>

        </div>
    </div>
</template>


<script lang="ts" setup>
import {ref, Ref} from '@vue/reactivity'
import {spotifyPlaybackState} from "~/composable/spotifyPlaybackState";
import {spotifyUserProfile} from "~/composable/spotifyUserProfile";

import {onBeforeMount} from "@vue/runtime-core";
import {Playlist, Track} from "spotify-types";
import {spotifyToken} from "~/composable/spotifyToken";
import useSpotifyAPI from "~/api/SpotifyAPI";

const api = useSpotifyAPI(spotifyToken().value)

const playlists: Ref<any[]> = ref([])
const playbackState: Ref<Track> = spotifyPlaybackState()
const expectedPlaylistsSize= ref(Number.MAX_SAFE_INTEGER)
const actualPlaylistsSize= ref(0)

onBeforeMount(() => {
    loadAllUserPlaylists()
})

function loadAllUserPlaylists(){
    api.getAllUserPlaylists().then(async (playlists: Playlist[]) => {

        // show only user playlists
        playlists = playlists.filter((value: any) => value.owner.id == spotifyUserProfile().value.id)

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

function addTrackToPlaylist(playlist: any){
    const playlist_id = playlist.id
    const spotify_uris: any[] = [playbackState.value.uri].flat()
    api.addTrackToPlaylist(playlist_id, spotify_uris).then(() => {
        loadPlaylistTracks(playlist)
    })
}

function removeTrackToPlaylist(playlist: any){
    const playlist_id = playlist.id
    const spotify_uris: any[] = [playbackState.value.uri].flat()
    api.deletePlaylistItem(playlist_id, spotify_uris).then(() => {
        loadPlaylistTracks(playlist)
    })
}

function isCurrentTrackInPlaylist(playlist: any) {
    console.log(playlist.allTracks)
    return playlist.allTracks.some((it: any) => it.track?.id == spotifyPlaybackState().value.id)
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
