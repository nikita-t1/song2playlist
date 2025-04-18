<template>
    <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between my-2">
            <span class="text-white font-bold">Player:</span>
            <LoadingSpinner v-if="isFetching" size="sm"/>
        </div>
        <img :src=imageUrl alt="" class=" rounded-3xl border-spotify-green border">
        <span class="mt-4 text-white font-bold text-center">{{ title }}</span>
        <span class="text-neutral-500 text-center">{{ artists }}</span>
        <span class="text-neutral-600 text-center text-sm">ID: {{ id }}</span>
        <span class="text-neutral-600 text-center text-sm">Release Year: {{ year }}</span>
        <span class="text-neutral-600 text-center text-sm">Popularity: {{ popularity }}</span>
        <span class="text-neutral-600 text-center text-sm">Album Genres: {{ albumGenres }}</span>
        <span class="text-neutral-600 text-center text-sm">Artists Genres: {{ artistsGenres }}</span>
        <SeekBar/>
        <PlaybackControls/>
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {isTrack} from "~/utils/isTrack";
import {storeToRefs} from "pinia";


const api = useSpotifyAPI()
const spotifyStore = useSpotifyStore()
const {playbackState} = storeToRefs(spotifyStore)

defineProps<{ isFetching: boolean }>()

const albumGenres = ref()
const artistsGenres = ref()
const fallbackImage = 'https://developer-assets.spotifycdn.com/images/guidelines/design/icon4.svg'

const title = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.name
})

const artists = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.artists.map((artist: any) => artist.name).join(', ')
})

const imageUrl = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return fallbackImage
    return playbackState.value.item.album.images[0].url
})

const id = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.id
})

const year = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.album.release_date.split('-')[0]
})

const popularity = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.popularity
})

const albumId = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return ''
    return playbackState.value.item.album.id
})

const artistsFull = computed(() => {
    if (!playbackState.value || !isTrack(playbackState.value.item)) return []
    return playbackState.value.item.artists
})

watch(albumId, async(oldVal, newVal) => {
    if (newVal == '') return
    console.log('fetching album')
    console.log(newVal)
    const res = await api.getAlbum(newVal)
    console.log(res.data)
    albumGenres.value = res.data.genres.join(', ')
})

/**
 * Fetches the genres of artists.
 *
 * @param {string[]} artistIds - An array of artist IDs.
 * @returns {Promise<string>} - A promise that resolves to a string representing the genres of the artists.
 */
async function fetchArtistsGenres(artistIds: string[]): Promise<string> {
    const res = await api.getArtists(artistIds);
    const allGenres: string[] = res.data.artists.flatMap((artist: any) => artist.genres);
    // remove duplicates
    const genres = allGenres.filter((genre, index) => allGenres.indexOf(genre) === index).join(', ');
    return `[${genres}]`;
}

watch(id, async () => {
    artistsGenres.value = '';
    const artistIds = artistsFull.value.map((artist: any) => artist.id);
    artistsGenres.value = await fetchArtistsGenres(artistIds);
});


</script>

<style scoped>

</style>
