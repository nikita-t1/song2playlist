<template>
    <div>
        <div class=" ">
            <ul class="max-w-xs flex flex-col  ">
                <li v-for="(item, index) in queue"
                    class=" cursor-pointer inline-flex flex-row inline-block items-center py-3 px-2 text-sm   text-white border-b"
                    @click="playQueuePos(index+1)">
                    <img :src="item[2]" alt=""
                         class="w-12 rounded border-spotify-green border border-transparent border-1">
                    <div class="flex flex-col ml-2">
                        <div class="text-white font-bold">{{ item[0] }}</div>
                        <div class="text-neutral-500">{{ item[1] }}</div>
                    </div>


                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {sleep} from "~/composable/sleep";
import useSpotifyAPI from "~/api/SpotifyAPI";
const api = useSpotifyAPI()

let queue = ref({})

let interval = 0;
onMounted(() => {
    interval = window.setInterval(function () {
        api.getQueue().then(res => {
            // map the queue to a more readable format
            console.log(res.data.queue)
            const q = res.data.queue.map((item: any) => [item.name, item.artists.map((artist: any) => artist.name).join(', '), item.album.images[0].url])
            queue.value = q
        }).catch(err => {
            console.log(err)
            queue.value = {}
        });

    }, 5000)
})
onUnmounted(() => {
    clearInterval(interval)
})


async function playQueuePos(index: number) {
    for (let i = 0; i < index; i++) {
        await api.skipToNextTrack()
        await sleep(300)
    }
}

</script>

<style scoped>

</style>
