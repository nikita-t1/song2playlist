<template>
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-spotify-black p-6">
        <div class="mb-8 text-center">
            <h1 class="mb-4 text-4xl font-bold text-spotify-green">Song2Playlist</h1>
            <p class="text-neutral-400">{{ message || 'Loading your Spotify experience...' }}</p>
        </div>

        <div class="w-full max-w-md">
            <div class="mb-2 flex justify-between text-sm text-neutral-400">
                <span>{{ current }} / {{ total }}</span>
                <span>{{ progress }}%</span>
            </div>
            <div class="h-3 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                    class="h-full bg-spotify-green transition-all duration-300 ease-out"
                    :style="{ width: `${progress}%` }"
                ></div>
            </div>
        </div>

        <div class="border rounded-2xl m-4 p-2 w-full max-w-md transition-all">
            <p class="text-neutral-400 p-1" v-for="name in playlistNames">
                {{ name }}
            </p>
        </div>

        <div class="mt-12">
            <LoadingSpinner size="lg"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    total: number
    current: number
    message?: string
    playlistNames?: string[]
}>()

const progress = computed(() => {
    if (props.total === 0) return 0
    return Math.min(Math.round((props.current / props.total) * 100), 100)
})
</script>
