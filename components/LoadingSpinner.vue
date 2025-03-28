<template>
    <div
        aria-label="loading"
        :class=selectedSize
        class="animate-spin inline-block border-[3px] border-current text-spotify-green aspect-square rounded-full border-t-transparent" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script lang="ts" setup>

import {type PropType} from "@vue/runtime-core";

type SpinnerSizes = "sm"| "md"| "lg"

const selectedSize = computed(() => {
    if (props.size == "sm") return "w-4 h-4"
    if (props.size == "md") return "w-10 h-10"
    if (props.size == "lg") return "w-24 h-24"
})

const props = defineProps({
    size: {
        required: false,
        type: String as PropType<SpinnerSizes>,
        default: "md"
    }
})
</script>
