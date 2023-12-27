<script lang="ts" setup>
import useSpotifyAPI from "~/api/SpotifyAPI";
import {useSpotifyStore} from "~/stores/useSpotifyStore";
import {storeToRefs} from "pinia";
import {PlaylistObjectSimplifiedWithTrack as Playlist} from "~/types/PlaylistObjectSimplifiedWithTrack";
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

const spotifyStore = useSpotifyStore()
const api = useSpotifyAPI()

const {playbackState} = storeToRefs(spotifyStore)

const props = defineProps<{ playlist: Playlist }>()

const playlist_id = props.playlist.id

const spotify_uris = computed(() => [spotifyStore.playbackState?.item?.uri ?? ""].flat())

const image = computed(() => {
    if (!props.playlist) return ""
    if (!props.playlist.images) return ""
    return props.playlist.images[0]?.url ?? ""
})

enum TrackMatch {
    ID,
    NAME,
    NONE
}

const isCurrentTrackInPlaylist = computed(() => {
    const pbs = playbackState.value
    if (!pbs) return TrackMatch.NONE
    // compare the current track id with the playlist tracks
    const matchedTrackId = props.playlist?.allTracks?.some((it: PlaylistTrackObject) => it.track?.id == pbs.item!.id) ?? false
    if (matchedTrackId) return TrackMatch.ID
    // compare the current track name with the playlist tracks
    const matchedTrackName = props.playlist?.allTracks?.some((it: PlaylistTrackObject) => it.track?.name == pbs.item!.name) ?? false
    if (matchedTrackName) return TrackMatch.NAME
    return TrackMatch.NONE
})

onMounted(() => {
    spotifyStore.fetchPlaylistTracks(api, props.playlist)
})

function addTrackToPlaylist() {
    api.addTrackToPlaylist(playlist_id, spotify_uris.value)
        .finally(() => {
            spotifyStore.fetchPlaylistTracks(api, props.playlist)
        })
}

function removeTrackToPlaylist() {
    api.deletePlaylistItem(playlist_id, spotify_uris.value)
        .finally(() => {
            spotifyStore.fetchPlaylistTracks(api, props.playlist)
        })
}

// change the icon when hovering
const hover = ref(false)

const emit = defineEmits(['hideThis'])
const hide = () => emit('hideThis', props.playlist)

const menu = ref();
const items = ref([
    {
        label: 'Hide', icon: 'ph:eye-slash', command: () => {
            hide()
        }
    },
]);

const onImageRightClick = (event: any) => {
    menu.value.show(event);
};

</script>

<template>
    <div class="group duration-500">
        <div
            :class="{ 'bg-emerald-500 hover:bg-red-500': isCurrentTrackInPlaylist != TrackMatch.NONE, 'bg-blue-500': isCurrentTrackInPlaylist == TrackMatch.NONE, 'bg-spotify-green-darkest' : isCurrentTrackInPlaylist == TrackMatch.NAME}"
            class="cursor-pointer w-8 h-8 absolute -m-2 text-center rounded-lg rounded-br-lg text-white duration-500"
            @mouseleave="hover = false" @mouseover="hover = true">
            <Icon v-if="isCurrentTrackInPlaylist != TrackMatch.NONE" :name="hover ? 'bi:x' : 'bi:check-lg'" size="24"
                  @click="removeTrackToPlaylist"/>
            <Icon v-else name="bi:plus" size="24" @click="addTrackToPlaylist"/>
        </div>

        <img v-if="playlist" :class="{'outline outline-4 outline-offset-4': isCurrentTrackInPlaylist != TrackMatch.NONE, 'outline-spotify-green': isCurrentTrackInPlaylist == TrackMatch.ID, 'outline-spotify-green-darkest' : isCurrentTrackInPlaylist == TrackMatch.NAME}" :src="image"
             alt="Playlist Image"
             aria-haspopup="true" class="h-48 w-48 rounded duration-300 group-hover:outline-none"
             @contextmenu="onImageRightClick">
        <div class="mt-1 text-center text-white">{{ playlist.name }}</div>
        <ContextMenu ref="menu" :model="items" class="bg-spotify-black border border-spotify-green rounded-lg">
            <template #item="{ item, props }">
                <a v-ripple
                   class="flex items-center hover:bg-spotify-green-darkest duration-100 py-2 px-8 m-2 rounded-lg text-white"
                   v-bind="props.action">
                    <Icon :name="item.icon" :size="'20'" class="text-white"/>
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" :value="item.badge" class="ml-auto"/>
                    <span v-if="item.shortcut"
                          class="ml-auto border border-surface-200 dark:border-surface-700 rounded surface-100 text-xs p-1">{{
                            item.shortcut
                        }}</span>
                    <i v-if="item.items" class="pi pi-angle-right ml-auto text-primary"></i>
                </a>
            </template>
        </ContextMenu>
    </div>
</template>
