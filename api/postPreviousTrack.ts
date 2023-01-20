import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export function postPreviousTrack() {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    axios.post(
        "https://api.spotify.com/v1/me/player/previous",
        {},
        {
            headers: {
                Authorization: "Bearer " + spotifyToken().value,
                'Content-Type': 'application/json'
            },
        }
    ).then(res => {
        console.log(res)
    })
}
