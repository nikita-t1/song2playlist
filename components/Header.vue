<script setup lang="ts">
import IconButton from "~/components/common/IconButton.vue";
import {inject} from "vue";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import useSpotifyAPI from "~/api/SpotifyAPI";
import {storeToRefs} from "pinia";

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playlists} = storeToRefs(spotifyStore)

const fetchPlaylists = inject('fetchPlaylists') as () => void
const setViewHiddenPlaylists = inject('setViewHiddenPlaylists') as () => void
const props = defineProps<{ showHidden: Boolean }>()

const playlistsChanged = ref(false)
watch(playlists, () => {
    playlistsChanged.value = true
    setTimeout(() => playlistsChanged.value = false, 1000)
}, {deep: true})

const profileImg = computed(() => {
    return spotifyStore.spotifyUserProfile?.images?.[0]?.url ?? ''
})

</script>

<template>
    <div class="flex flex-row w-full justify-between">
        <div class="flex">
            <div class="flex gap-2 items-center  outline-1 p-1 outline-green-500 rounded-lg">
                <img class="w-6 h-6" src="/song2playlist_light.ico" alt="brand icon">
                <span class="text-2xl font-bold text-white font-mono">song2playlist</span>
            </div>
            <LoadingSpinner v-if="playlistsChanged" size="md" class="mx-4"/>
        </div>
        <div class="flex space-x-3">
            <IconButton :name="[showHidden ? 'ph:eye-slash' : 'ph:eye-light'].join('')" tooltip="show hidden playlists" size="20" :action="setViewHiddenPlaylists"/>
            <IconButton name="ph:arrows-clockwise-bold" tooltip="reload playlists" size="20" :action="fetchPlaylists"/>
            <img class="rounded-full  outline-2 outline-green-500 w-10 h10" :src="profileImg" alt="profile picture">
        </div>

    </div>
</template>

<style scoped>

</style>
