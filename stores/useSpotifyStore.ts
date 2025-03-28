import {defineStore, skipHydrate} from "pinia";
import {useStorage} from "@vueuse/core";
import {type PlaylistObjectSimplifiedWithTrack} from "~/types/PlaylistObjectSimplifiedWithTrack";
import {type ISpotifyAPI} from "~/api/SpotifyAPI";
type CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;
type CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;
type PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

export const useSpotifyStore = defineStore('spotifyStore', () => {
    const playbackState = useState<CurrentPlaybackResponse | null>('playbackState', () => null)
    const spotifyUserProfile = useStorage<CurrentUsersProfileResponse | null>('spotifyUserProfile', null)
    const playlists = useState<PlaylistObjectSimplifiedWithTrack[]>('playlists', () => [])

    function setPlaybackState(state: CurrentPlaybackResponse) {
        playbackState.value = state
    }

    function setSpotifyUserProfile(profile: CurrentUsersProfileResponse) {
        spotifyUserProfile.value = profile
    }

    function setPlaylists(newPlaylists: PlaylistObjectSimplifiedWithTrack[]) {
        playlists.value = newPlaylists
    }

    async function fetchPlaylistTracksAsync(api: ISpotifyAPI, playlist: PlaylistObjectSimplifiedWithTrack) {
        const tracks = await api.getAllPlaylistTracks(playlist.tracks.href)
        setAllTracks(playlist, tracks)
    }

    function fetchPlaylistTracks(api: ISpotifyAPI, playlist: PlaylistObjectSimplifiedWithTrack) {
        api.getAllPlaylistTracks(playlist.tracks.href).then((tracks) => {
            setAllTracks(playlist, tracks)
        })
    }

    function setAllTracks(playlist: PlaylistObjectSimplifiedWithTrack, tracks: PlaylistTrackObject[]) {
        const storedPlaylist = playlists.value.find((p) => p.id === playlist.id)!
        storedPlaylist.allTracks = tracks
        // const copy = [...playlists.value]
        // copy.find((p) => p.id === playlist.id)!.allTracks = tracks
        // playlists.value = copy
    }

    return {
        playbackState,
        spotifyUserProfile: skipHydrate(spotifyUserProfile), // https://pinia.vuejs.org/cookbook/composables.html#ssr
        playlists,
        setPlaybackState,
        setSpotifyUserProfile,
        setPlaylists,
        fetchPlaylistTracksAsync,
        fetchPlaylistTracks
    }
})
