<template>
    <div class="flex flex-col justify-center items-center h-screen bg-spotify-black">
        <div class="p-4 leading-10  text-spotify-green text-xl font-bold tracking-wider">
            <h2>Welcome to<span class="font-mono">'song2playlist'</span></h2>
        </div>
        <div class="leading-10  text-spotify-green text-lg font-bold tracking-wider">
            Please Login with your Spotify Account
        </div>
        <a href="/api/login">
            <button
                class="text-white m-6 p-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold border-spotify-green  bg-spotify-green-darkest"
                type="button">
                <Icon name="logos:spotify-icon" size="24"></Icon>
                Login
            </button>
        </a>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

</style>
