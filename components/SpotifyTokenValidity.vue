<template>
    <div class="text-neutral-500 mt-3">token_expires_in: {{ diffInSeconds }}</div>
</template>

<script lang="ts" setup>

import {spotifyTokenValidity} from "~/composable/spotifyTokenValidity";

onMounted(() => {
    checkSpotifyTokenEverySecond()
})

const diffInSeconds = ref(0)

function checkSpotifyTokenEverySecond() {
    const intervalID = setInterval(function () {
        const date = new Date()
        const expiresIn: Date = new Date(spotifyTokenValidity().value)
        diffInSeconds.value = Math.round((expiresIn.getTime() - date.getTime()) / 1000);
    }, 1000)
}


</script>

<style scoped>

</style>
