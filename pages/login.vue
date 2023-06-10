<template>
    <div class="flex h-screen justify-center items-center bg-spotify-black space-x-12 p-12">
        <WelcomeCard />
        <LoginInput />
    </div>
</template>

<script lang="ts" setup>
import WelcomeCard from "~/components/WelcomeCard.vue";
import LoginInput from "~/components/LoginInput.vue";
</script>

<style scoped>

</style>
