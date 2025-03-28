<script lang="ts" setup>
const props = defineProps<{
    name: string,
    tooltip: string,
    size: string,
    action: () => void
}>()
</script>

<template>
    <div class="mx-1 hs-tooltip inline-block [--placement:bottom]">
        <button class="bg-green-500 hs-tooltip-toggle rounded-sm w-10 h-10 flex justify-center items-center hover:bg-green-600"
                @click="action">
            <Icon :name="name" :size="size" class="text-white"/>
            <span
                class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-xs"
                role="tooltip">
              {{ tooltip }}
            </span>
        </button>
    </div>
</template>

<style scoped>

</style>
