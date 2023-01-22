import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export async function getAllUserPlaylists(owner: string) {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    const playlists =  await getUserPlaylistsByUrl("https://api.spotify.com/v1/me/playlists?limit=50&offset=0")
    return playlists.filter((value: any) => value.owner.id == owner)

}

async function getUserPlaylistsByUrl(url: string): Promise<any> {
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
        const next = await getUserPlaylistsByUrl(response.data.next)
        return next.concat(response.data.items)
    } else {
        return response.data.items
    }
}
