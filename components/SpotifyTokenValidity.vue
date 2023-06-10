<template>
    <div class="text-neutral-500 mt-3">token_expires_in: {{ diffInSeconds }}</div>
</template>

<script lang="ts" setup>
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";

const authStore = useAuthorizationStore()

onMounted(() => {
    checkSpotifyTokenEverySecond()
})

const diffInSeconds = ref(0)

function checkSpotifyTokenEverySecond() {
    const intervalID = setInterval(function () {
        const date = new Date()
        const expiresIn: Date = new Date(authStore.spotifyTokenValidity)
        diffInSeconds.value = Math.round((expiresIn.getTime() - date.getTime()) / 1000);
    }, 1000)
}


</script>

<style scoped>

</style>
