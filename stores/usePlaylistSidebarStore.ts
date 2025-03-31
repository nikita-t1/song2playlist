import type {PlaylistObjectSimplifiedWithTrack} from "~/types/PlaylistObjectSimplifiedWithTrack";

export const usePlaylistSidebarStore = defineStore('playlistSidebarStore', () => {

    const activeState = ref<boolean>(false)
    const shownPlaylist = ref<PlaylistObjectSimplifiedWithTrack | null>(null)

    function openSidebar(playlist: PlaylistObjectSimplifiedWithTrack) {
        shownPlaylist.value = playlist
        activeState.value = true
    }

    function closeSidebar() {
        activeState.value = false
        shownPlaylist.value = null
    }

    return {
        activeState,
        shownPlaylist,
        openSidebar,
        closeSidebar
    }
})
