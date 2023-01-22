import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export async function getPlaylistTracks(url: string) {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    return await getPlaylistTracksRecursive(url + "?limit=50")
}

async function getPlaylistTracksRecursive(url: string): Promise<any> {
    const response = await axios.get(
        url,
        {
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + spotifyToken().value,
                'Content-Type': 'application/json'
            },
        }
    )
    if (response.data.next != null) {
        const next = await getPlaylistTracksRecursive(response.data.next)
        return next.concat(response.data.items)
    } else {
        return response.data.items
    }
}
