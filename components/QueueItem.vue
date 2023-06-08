<script lang="ts" setup>
import ArtistObjectSimplified = SpotifyApi.ArtistObjectSimplified;
import TrackObjectFull = SpotifyApi.TrackObjectFull;

defineProps<{ track: TrackObjectFull }>()

function convertArtistsToReadableFormat(artists: Array<ArtistObjectSimplified>) {
    return artists.map((artist: ArtistObjectSimplified) => artist.name).join(', ')
}

</script>

<template>
    <div class="inline-flex flex-row items-center">
        <img :src="track.album.images.at(0).url" alt=""
             class="w-12 rounded border-spotify-green border border-transparent border-1">
        <div class="flex flex-col ml-2">
            <div class="text-white font-bold">{{ track.name }}</div>
            <div class="text-neutral-500">{{ convertArtistsToReadableFormat(track.artists) }}</div>
        </div>
    </div>
</template>
