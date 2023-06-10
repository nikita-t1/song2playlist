<script lang="ts" setup>

</script>

<template>
    <div class="flex flex-col w-full px-6 max-w-lg max-h-[40rem] bg-neutral-800 h-full justify-center rounded-lg">
        <div class="grow flex flex-col justify-center items-center content-center">
            <div class="p-4 text-white text-2xl font-bold mb-6 text-center">
                <h2>Welcome to<span class="font-mono"> song2playlist</span></h2>
            </div>
            <p class="text-gray-400 "><span class="font-mono text-spotify-green">song2playlist</span> helps to manage
                tracks across different playlists.
                <br><br>
                It allows you to instantly see which
                playlists a track is part of and quickly add/remove the track from a playlist.
            </p>
        </div>

        <NuxtLink class="hover:underline text-gray-400 text-center items-center justify-center flex space-x-2 p-2 text-sm" to="https://github.com/nikita-t1/song2playlist">
            <Icon name="grommet-icons:github" size="14"/>
            <span>Source Code available on GitHub</span>
        </NuxtLink>
    </div>
</template>

<style scoped>

</style>
