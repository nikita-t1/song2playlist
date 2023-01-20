import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";
import axiosRetry from "axios-retry";

export async function getUserProfile(){
    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 500;
        }
    });
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
}
