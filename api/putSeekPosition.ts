import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export function putSeekPosition(requestedPosition: number) {
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
    axios.put(
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
    ).then(res => {
        console.log(res)
    })
}
