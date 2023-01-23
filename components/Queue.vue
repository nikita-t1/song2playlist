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
import {getQueue, postNextTrack} from "~/api/SpotifyAPI";

let queue = ref({})


setInterval(function () {
    getQueue().then(res => {
        queue.value = res
    });
}, 5000)

async function playQueuePos(index: number) {
    for (let i = 0; i < index; i++) {
        postNextTrack()
        await sleep(300)
    }
}

</script>

<style scoped>

</style>
