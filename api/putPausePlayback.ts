import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export function putPausePlayback() {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    axios.put(
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
    ).then(res => {
        console.log(res)
    })
}
