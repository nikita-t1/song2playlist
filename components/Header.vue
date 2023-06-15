<script setup lang="ts">
import IconButton from "~/components/common/IconButton.vue";

import {inject} from "vue";
const fetchPlaylists = inject('fetchPlaylists') as () => void

</script>

<template>
    <div class="flex">
        <IconButton name="ph:arrows-clockwise-bold" tooltip="reload playlists" size="20" :action="fetchPlaylists"/>
    </div>
</template>

<style scoped>

</style>
