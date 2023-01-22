import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export async function deletePlaylistItem(playlist_id: string, spotify_uris: any[]) {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    await axios.delete(
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
