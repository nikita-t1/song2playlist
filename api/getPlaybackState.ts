import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";

export function getPlaybackState() {
    return axios.get(
        "https://api.spotify.com/v1/me/player",
        {
            headers: {
                Authorization: "Bearer " + spotifyToken().value,
                'Content-Type': 'application/json'
            },
        }
    )
}
