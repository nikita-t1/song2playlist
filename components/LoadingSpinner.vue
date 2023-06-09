<template>
    <div
        aria-label="loading"
        :class=selectedSize
        class="animate-spin inline-block border-[3px] border-current border-t-transparent text-spotify-green rounded-full" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script lang="ts" setup>

import {PropType} from "@vue/runtime-core";

type Sizes = "sm"| "md"| "lg"

const selectedSize = computed(() => {
    if (props.size == "sm") return "w-4 h-4"
    if (props.size == "md") return "w-10 h-10"
    if (props.size == "lg") return "w-24 h-24"
})

const props = defineProps({
    size: {
        required: false,
        type: Object as PropType<Sizes>,
        default: "md"
    }
})
</script>
