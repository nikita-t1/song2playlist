<template>
    <div class="flex flex-col h-full overflow-y-auto ">
        <div class="flex items-center justify-between my-2">
            <span class="text-white font-bold">Queue:</span>
            <LoadingSpinner v-if="isFetching" size="sm"/>
        </div>
        <div class="overflow-y-auto">
            <ul class="flex flex-col">
                <li v-for="(item, index) in queue" :key="index" class="py-1.5 px-2 text-sm text-white">
                    <QueueItem :track="item"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import useSpotifyAPI from "~/api/SpotifyAPI";
import {isTrack} from "~/utils/isTrack";
type TrackObjectFull = SpotifyApi.TrackObjectFull;
import {type Ref} from "vue";

const isFetching = ref(false)
const queue: Ref<TrackObjectFull[] | null> = ref(null)

let interval = 0;
onMounted(() => {
    interval = window.setInterval(() => fetchQueue(), 3000)
})
onUnmounted(() => {
    clearInterval(interval)
})

function fetchQueue() {
    isFetching.value = true
    useSpotifyAPI().getQueue().then(res => {
        if (res.data.queue.length === 0) return
        queue.value = res.data.queue.filter(item => isTrack(item)) as TrackObjectFull[]
    }).catch(err => {
        console.log(err)
        queue.value = []
    }).finally(() => {
        isFetching.value = false
    });
}

</script>
