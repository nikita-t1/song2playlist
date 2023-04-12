<template>
	<div>
		<NuxtPage :key="$route.fullPath"/>
	</div>
</template>

<script lang="ts">
const isDark = usePreferredDark()
const favicon = computed(() => isDark.value ? 'song2playlist_light.ico' : 'song2playlist_dark.ico')

export default defineNuxtComponent({
    head(nuxtApp: any) {
        return {
            title: 'song2playlist',
            link: [
                {rel: 'icon', type: 'image/x-icon', href: "/" +  favicon.value},
            ]
        }
    },
})
</script>


