import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 500;
    }
});

const SpotifyAPI = {
    getPlaybackState: async () => {
        return await axios.get(
            "https://api.spotify.com/v1/me/player",
            {
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    getPlaylistTracks: async (url: string) => {
        return await axios.get(
            url + "?limit=50",
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    getAllPlaylistTracks: async (url: string) => {
        // @ts-ignore
        const tracks = await SpotifyAPI.getPlaylistTracks(url)
        if (tracks.data.next != null) {
            // @ts-ignore
            const next = await SpotifyAPI.getPlaylistTracks(tracks.data.next)
            return next.data.items.concat(tracks.data.items)
        } else {
            return tracks.data.items
        }
    },
    getUserPlaylist: async (url: string) => {
        return await axios.get(
            url,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    getAllUserPlaylists: async () => {
        // @ts-ignore
        const playlists = await SpotifyAPI.getUserPlaylist("https://api.spotify.com/v1/me/playlists?limit=50&offset=0")
        if (playlists.data.next != null) {
            // @ts-ignore
            const next = await SpotifyAPI.getUserPlaylist(playlists.data.next)
            console.log(next)
            console.log(typeof next)
            return next.data.items.concat(playlists.data.items)
        } else {
            return playlists.data.items
        }
    },
    getQueue: async () => {
        return await axios.get(
            "https://api.spotify.com/v1/me/player/queue",
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                },
            }
        )
    },
    getUserProfile: async () => {
        return await axios.get(
            "https://api.spotify.com/v1/me",
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    postNextTrack: async () => {
        return await axios.post(
            "https://api.spotify.com/v1/me/player/next",
            {},
            {
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    postPlaylistItem: async (playlist_id: string, spotify_uris: any[]) => {
        return await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                uris: spotify_uris
            },
            {
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    postPreviousTrack: async () => {
        return await axios.post(
            "https://api.spotify.com/v1/me/player/previous",
            {},
            {
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    putPausePlayback: async () => {
        return await axios.put(
            "https://api.spotify.com/v1/me/player/pause",
            {
                "position_ms": 0,
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    putResumePlayback: async (device_id: string) => {
        return await axios.put(
            "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
            {
                "position_ms": 0,
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    },
    putSeekPosition: async (requestedPosition: number) => {
        return await axios.put(
            "https://api.spotify.com/v1/me/player/seek?position_ms=" + requestedPosition,
            {
                // "position_ms": requestetPosition,
                // "device_id": activeDevice
            },
            {
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                },
            }
        )
    },
    deletePlaylistItem: async (playlist_id: string, spotify_uris: any[]) => {
        return await axios.delete(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                data: {
                    uris: spotify_uris
                },
                headers: {
                    Authorization: "Bearer " + spotifyToken().value,
                    'Content-Type': 'application/json'
                },
            }
        )
    }

}
export default SpotifyAPI
