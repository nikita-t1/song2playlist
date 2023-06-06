import {defineStore} from "pinia";
import CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;
import CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;
import {useStorage} from "@vueuse/core";
import {Ref} from "vue";

export const useSpotifyStore = defineStore('spotifyStore', () => {
    const spotifyToken = useStorage('spotifyToken', "")
    const spotifyRefreshToken = useStorage('spotifyRefreshToken', "")
    const spotifyTokenValidity = useStorage('spotifyTokenValidity', 0)
    let playbackState: CurrentPlaybackResponse | undefined
    const spotifyUserProfile: Ref<CurrentUsersProfileResponse | undefined> = ref()

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
        spotifyUserProfile,
        setPlaybackState,
        setSpotifyUserProfile
    }
})
