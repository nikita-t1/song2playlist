import * as querystring from "querystring";
import axios, {isCancel, AxiosError} from 'axios';
import * as queryString from "querystring";
import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} from "~/const/const";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const authCode = query.authCode as string
    const state = query.state as string

    if (state === null) {
        //TODO: Create Custom Error Page for this
        const url = ('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
        console.log("state_mismatch")
        return {}
    } else {
        const spotifyResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            queryString.stringify({
                code: authCode,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            {
                headers: {
                    Authorization: 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
                },
            })
        console.log(spotifyResponse.data)
        return spotifyResponse.data
    }
})
