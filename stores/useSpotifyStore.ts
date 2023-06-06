import {defineStore, skipHydrate} from "pinia";
import CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;
import CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;
import {StorageSerializers, useStorage} from "@vueuse/core";
import {Ref} from "vue";

export const useSpotifyStore = defineStore('spotifyStore', () => {
    const spotifyToken = useCookie('spotifyToken', {default: () => ""})
    const spotifyRefreshToken = useCookie('spotifyRefreshToken', {default: () => ""})
    const spotifyTokenValidity = useCookie('spotifyTokenValidity', {default: () => 0})
    let playbackState: CurrentPlaybackResponse | undefined
    const spotifyUserProfile = useStorage<CurrentUsersProfileResponse | {}>('spotifyUserProfile', {})

    function setPlaybackState(state: CurrentPlaybackResponse) {
        playbackState = state
    }

    function setSpotifyUserProfile(profile: CurrentUsersProfileResponse) {
        spotifyUserProfile.value = profile
    }

    return {
        playbackState,
        spotifyToken,
        spotifyRefreshToken,
        spotifyTokenValidity,
        spotifyUserProfile: skipHydrate(spotifyUserProfile), // https://pinia.vuejs.org/cookbook/composables.html#ssr
        setPlaybackState,
        setSpotifyUserProfile
    }
})
