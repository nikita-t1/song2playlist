<template>
    <div class="flex flex-row h-screen">

        <div class="w-72 min-w-[18rem] bg-black flex flex-col justify-end p-4 border-1 border border-spotify-green ">
            <span class="text-white font-bold">Queue:</span>
            <Queue class="overflow-hidden overflow-y-scroll my-4"/>
            <Player/>
            <SpotifyTokenValidity class="text-center"/>
        </div>

        <Playlists />


    </div>


</template>

<script lang="ts" setup>
import Queue from "~/components/Queue.vue";
import Player from "~/components/Player.vue";
import SpotifyTokenValidity from "~/components/SpotifyTokenValidity.vue";
import Playlists from "~/components/Playlists.vue";
</script>

<style scoped>

</style>
