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

const topFiveTracks = computed(() => {
    const top =  props.playlist?.allTracks?.slice(0, 5) ?? []
    // alert(JSON.stringify(top))
    if (!top) return []
    return top.map((it: PlaylistTrackObject) => {
        return {
            added_at: it.added_at,
            name: it.track?.name,
            category: it.track?.album?.name,
            quantity: it.track?.artists?.map((it) => it.name).join(", ")
        }
    })
})

const topFiveTracksCollapsed = ref(false)

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
    {
        label: 'Reload', icon: 'ph:arrows-clockwise-bold', command: () => {
            spotifyStore.fetchPlaylistTracks(api, props.playlist)
        }
    },
    {
        label: 'Add to Playlist', icon: 'ph:plus', command: () => {
            addTrackToPlaylist()
        }
    },
    {
        label: 'Remove from Playlist', icon: 'ph:minus', command: () => {
            removeTrackToPlaylist()
        }
    },
    {
        label: 'Open in Spotify', icon: 'ph:spotify-logo', command: () => {
            window.open(props.playlist.external_urls.spotify, '_blank')
        }
    },
]);

const onImageRightClick = (event: any) => {
    menu.value.show(event);
};

</script>

<template>
    <div class="group duration-500">

        <!-- Add/Remove track from playlist button -->
        <div
            :class="{ 'bg-emerald-500 hover:bg-red-500': isCurrentTrackInPlaylist != TrackMatch.NONE, 'bg-blue-500': isCurrentTrackInPlaylist == TrackMatch.NONE, 'bg-spotify-green-darkest' : isCurrentTrackInPlaylist == TrackMatch.NAME}"
            class="cursor-pointer w-8 h-8 absolute -m-2 text-center rounded-lg rounded-br-lg text-white duration-500"
            @mouseleave="hover = false" @mouseover="hover = true">
            <Icon v-if="isCurrentTrackInPlaylist != TrackMatch.NONE" :name="hover ? 'bi:x' : 'bi:check-lg'" size="24"
                  @click="removeTrackToPlaylist"/>
            <Icon v-else name="bi:plus" size="24" @click="addTrackToPlaylist"/>
        </div>

        <!-- Playlist Image -->
        <img v-if="playlist" :class="{'outline outline-4 outline-offset-4': isCurrentTrackInPlaylist != TrackMatch.NONE, 'outline-spotify-green': isCurrentTrackInPlaylist == TrackMatch.ID, 'outline-spotify-green-darkest' : isCurrentTrackInPlaylist == TrackMatch.NAME}" :src="image"
             alt="Playlist Image"
             aria-haspopup="true" class="h-48 w-48 rounded duration-300 group-hover:outline-none"
             @contextmenu="onImageRightClick">

        <!-- Playlist Name -->
<!--        <div class="mt-1 text-center text-white">{{ playlist.name }}</div>-->
        <Panel @update:collapsed="value => topFiveTracksCollapsed = value" :collapsed="true" :header="playlist.name" toggleable class="mt-2 text-center text-white " label="Button">
            <DataTable :value="topFiveTracks" class="m-1 outline outline-1 p-1 outline-spotify-green rounded truncate text-start">
                <Column field="name" class=""></Column>
<!--                <Column field="name" header="Name"></Column>-->
<!--                <Column field="category" header="Category"></Column>-->
<!--                <Column field="quantity" header="Quantity"></Column>-->
            </DataTable>
<!--            <p class="m-0">-->
<!--                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.-->
<!--                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.-->
<!--            </p>-->
        </Panel>

        <!-- Context Menu -->
        <ContextMenu ref="menu" :model="items" class="bg-spotify-black shadow-2xl border-2 border-spotify-green rounded-lg">
            <template #item="{ item, props }">
                <a
                   class="flex hover:bg-spotify-green-darkest duration-100 py-2 px-4 pr-8 m-2 rounded-lg text-white"
                   v-bind="props.action">
                    <Icon :name="item.icon" :size="'20'" class="text-white"/>
                    <span class="ml-4 grow">{{ item.label }}</span>
                </a>
            </template>
        </ContextMenu>
    </div>
</template>
