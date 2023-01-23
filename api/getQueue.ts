import axios from "axios";
import {spotifyToken} from "~/composable/spotifyToken";

export async function getQueue(){
    const token: string = spotifyToken().value
    console.log(token)
    const response = await axios.get(
        "https://api.spotify.com/v1/me/player/queue",
        {
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + token,
            },
        }
    ).catch(function (error) {
        if (error.response) {
            return undefined;
        }
    })
    if (response == undefined) return {}
    return response.data.queue.map((item: any) => [item.name, item.artists.map((artist: any) => artist.name).join(', '), item.album.images[0].url])
}
