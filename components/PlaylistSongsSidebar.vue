<template>
    <div v-if="sidebarStore.shownPlaylist != null" class="w-72 min-w-[18rem] border border-spotify-green ms-0.5 flex flex-col">
        <div class="w-full flex justify-end flex-none">
            <div class="m-2 cursor-pointer w-8 h-8 text-right rounded-lg rounded-br-lg text-white duration-500 bg-spotify-green items-center justify-center flex">
                <Icon name="bi:x" size="20" @click="sidebarStore.closeSidebar()"/>
            </div>
        </div>
        <ul class="text-white overflow-y-scroll grow">
            <li class="flex p-2 py-2" v-for="song in validTracks" :key="song.track!.id">
                <img loading="lazy" :src="song.track!.album.images[0]?.url ?? fallbackImage" alt="" class="w-12 h-12 rounded">
                <div class="flex flex-col ms-2 text-sm">
                    <span class="text-neutral-300">{{song.track!.name}}</span>
                    <span class="text-neutral-600 ">{{song.track!.album.artists[0].name}}</span>
                </div>
            </li>
        </ul>

    </div>
</template>

<script setup lang="ts">

import {usePlaylistSidebarStore} from "~/stores/usePlaylistSidebarStore";
const sidebarStore = usePlaylistSidebarStore()
const validTracks = computed(() => sidebarStore.shownPlaylist?.allTracks.filter((song) => song.track != null && song.track.id != null))

const fallbackImage = 'https://developer-assets.spotifycdn.com/images/guidelines/design/icon4.svg'

</script>

<style scoped>
</style>
