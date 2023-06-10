import {defineStore, skipHydrate} from "pinia";
import CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;
import CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;
import {StorageSerializers, useStorage} from "@vueuse/core";
import {Ref} from "vue";

export const useSpotifyStore = defineStore('spotifyStore', () => {
    const playbackState = useState<CurrentPlaybackResponse | null>('playbackState', () => null)
    const spotifyUserProfile = useStorage<CurrentUsersProfileResponse | {}>('spotifyUserProfile', {})

    function setPlaybackState(state: CurrentPlaybackResponse) {
        playbackState.value = state
    }

    function setSpotifyUserProfile(profile: CurrentUsersProfileResponse) {
        spotifyUserProfile.value = profile
    }

    return {
        playbackState,
        spotifyUserProfile: skipHydrate(spotifyUserProfile), // https://pinia.vuejs.org/cookbook/composables.html#ssr
        setPlaybackState,
        setSpotifyUserProfile
    }
})
