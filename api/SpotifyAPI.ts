import axios, {AxiosInstance, AxiosResponse} from "axios";
import axiosRetry from "axios-retry";
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";

import CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;
import CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;
import PlaylistTrackResponse = SpotifyApi.PlaylistTrackResponse;
import ListOfCurrentUsersPlaylistsResponse = SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
import UsersQueueResponse = SpotifyApi.UsersQueueResponse;
import AddTracksToPlaylistResponse = SpotifyApi.AddTracksToPlaylistResponse;
import RemoveTracksFromPlaylistResponse = SpotifyApi.RemoveTracksFromPlaylistResponse;
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

export interface ISpotifyAPI {
    getPlaybackState(): Promise<AxiosResponse<CurrentPlaybackResponse>>
    getPlaylistTracks(url: string): Promise<AxiosResponse<PlaylistTrackResponse>>
    getAllPlaylistTracks(url: string): Promise<PlaylistTrackObject[]>
    getUserPlaylists(url: string): Promise<AxiosResponse<ListOfCurrentUsersPlaylistsResponse>>
    getAllUserPlaylists(): Promise<PlaylistObjectSimplified[]>
    getQueue(): Promise<AxiosResponse<UsersQueueResponse>>
    getUserProfile(): Promise<AxiosResponse<CurrentUsersProfileResponse>>
    skipToNextTrack(): Promise<AxiosResponse<void>>
    addTrackToPlaylist(playlistId: string, uris: string[]): Promise<AxiosResponse<AddTracksToPlaylistResponse>>
    skipToPreviousTrack(): Promise<AxiosResponse<void>>
    pausePlayback(): Promise<AxiosResponse<void>>
    resumePlayback(device_id: string): Promise<AxiosResponse<void>>
    setSeekPosition(positionMs: number): Promise<AxiosResponse<void>>
    deletePlaylistItem(playlist_id: string, spotify_uris: string[]): Promise<AxiosResponse<RemoveTracksFromPlaylistResponse>>
}

/**
 * SpotifyAPI class for interacting with the Spotify API
 * https://developer.spotify.com/documentation/web-api/
 */
class SpotifyAPI implements ISpotifyAPI {

    private readonly spotifyToken: string;
    private readonly reqInstance: AxiosInstance;

    constructor(spotifyToken: string) {
        this.spotifyToken = spotifyToken

        this.reqInstance = axios.create({
            // set the headers for all requests
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + this.spotifyToken,
                'Content-Type': 'application/json'
            }
        })

        axiosRetry(this.reqInstance, {
            retries: 3,
            retryDelay: (retryCount) => {
                return retryCount * 500;
            }
        });
    }

    /**
     * Get information about the user’s current playback state, including track or episode, progress, and active device.
     * https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
     */
    async getPlaybackState(): Promise<AxiosResponse<CurrentPlaybackResponse>> {
        return await this.reqInstance.get<CurrentPlaybackResponse>("https://api.spotify.com/v1/me/player")
    }

    /**
     * Get full details of the items of a playlist owned by a Spotify user.
     * @param url The URL to get the playlist from.
     * https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
     */
    async getPlaylistTracks(url: string): Promise<AxiosResponse<PlaylistTrackResponse>> {
        return await this.reqInstance.get<PlaylistTrackResponse>(url, {
            params: {
                limit: 50
            }
        })
    }

    /**
     * Get full details of ALL items of a playlist owned by a Spotify user.
     * @param url The URL to get the playlist from.
     * @see getPlaylistTracks
     */
    async getAllPlaylistTracks(url: string): Promise<PlaylistTrackObject[]> {
        const tracks = await this.getPlaylistTracks(url)
        console.log(tracks.data.next)
        while (tracks.data.next != null) {
            const next = await this.getPlaylistTracks(tracks.data.next)
            tracks.data.items = tracks.data.items.concat(next.data.items)
            tracks.data.next = next.data.next
        }
        return tracks.data.items
    }

    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * @param url The URL to get the playlists from.
     * https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
     */
    async getUserPlaylists(url: string = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0"): Promise<AxiosResponse<ListOfCurrentUsersPlaylistsResponse>> {
        return await this.reqInstance.get<ListOfCurrentUsersPlaylistsResponse>(url)
    }

    /**
     * Get a list of ALL playlists owned or followed by the current Spotify user.
     * @see getUserPlaylists
     */
    async getAllUserPlaylists(): Promise<PlaylistObjectSimplified[]> {
        const playlists = await this.getUserPlaylists()
        if (playlists.data.next != null) {
            const next = await this.getUserPlaylists(playlists.data.next)
            return next.data.items.concat(playlists.data.items)
        } else {
            return playlists.data.items
        }
    }

    /**
     * Get the list of objects that make up the user's queue.
     * https://developer.spotify.com/documentation/web-api/reference/get-queue/
     */
    async getQueue(): Promise<AxiosResponse<UsersQueueResponse>> {
        return await this.reqInstance.get<UsersQueueResponse>("https://api.spotify.com/v1/me/player/queue",)
    }

    /**
     * Get detailed profile information about the current user (including the current user's username).
     * https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile/
     */
    async getUserProfile() {
        return await this.reqInstance.get<CurrentUsersProfileResponse>("https://api.spotify.com/v1/me")
    }

    /**
     * Skips to next track in the user’s queue.
     * https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track
     */
    async skipToNextTrack(): Promise<AxiosResponse<void>> {
        return await this.reqInstance.post("https://api.spotify.com/v1/me/player/next")
    }

    /**
     * Add one or more items to a user's playlist.
     * @param playlist_id The Spotify ID for the playlist.
     * @param spotify_uris A comma-separated list of Spotify URIs to add.
     * https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
     */
    async addTrackToPlaylist(playlist_id: string, spotify_uris: string[]): Promise<AxiosResponse<AddTracksToPlaylistResponse>> {
        return await this.reqInstance.post<AddTracksToPlaylistResponse>(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                uris: spotify_uris
            }
        )
    }

    /**
     * Skips to previous track in the user’s queue.
     * https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track
     */
    async skipToPreviousTrack(): Promise<AxiosResponse<void>> {
        return await this.reqInstance.post("https://api.spotify.com/v1/me/player/previous")
    }

    /**
     * Pause playback on the user's account.
     * https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback
     */
    async pausePlayback(): Promise<AxiosResponse<void>> {
        return await this.reqInstance.put(
            "https://api.spotify.com/v1/me/player/pause",
            {
                "position_ms": 0,
            }
        )
    }

    /**
     * Start a new context or resume current playback on the user's active device.
     * @param device_id The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
     * https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback
     */
    async resumePlayback(device_id: string): Promise<AxiosResponse<void>> {
        return await this.reqInstance.put(
            "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
            {
                "position_ms": 0,
            }
        )
    }

    /**
     * Seeks to the given position in the user’s currently playing track.
     * @param positionMs The position in milliseconds to seek to. Must be a positive number.
     * https://developer.spotify.com/documentation/web-api/reference/seek-to-position-in-currently-playing-track
     */
    async setSeekPosition(positionMs: number): Promise<AxiosResponse<void>> {
        return await this.reqInstance.put(
            "https://api.spotify.com/v1/me/player/seek?position_ms=" + positionMs,
            {
                // "position_ms": requestetPosition,
                // "device_id": activeDevice
            }
        )
    }

    /**
     * Remove one item from a user's playlist.
     * @param playlist_id The Spotify ID of the playlist
     * @param spotify_uris An array of objects containing Spotify URIs of the tracks or episodes to remove.
     * https://developer.spotify.com/documentation/web-api/reference/remove-tracks-playlist
     */
    async deletePlaylistItem(playlist_id: string, spotify_uris: string[]): Promise<AxiosResponse<RemoveTracksFromPlaylistResponse>> {
        return await this.reqInstance.delete<RemoveTracksFromPlaylistResponse>(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                data: {
                    uris: spotify_uris
                }
            }
        )
    }
}

export async function getSpotifyAccessToken(body: Object) {
    return await axios.post(
        "https://accounts.spotify.com/api/token",
        body,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    )
}

const useSpotifyAPI = (spotifyToken: string = useAuthorizationStore().spotifyAccessToken) => {
    return new SpotifyAPI(spotifyToken)
}

export default useSpotifyAPI
