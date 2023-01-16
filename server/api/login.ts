import * as querystring from "querystring";
import {CLIENT_ID, REDIRECT_URI, STATE} from "~/const/const";

export default defineEventHandler((event) => {
    const scope = `
        user-read-private 
        playlist-read-private
        playlist-modify-private 
        playlist-modify-public 
        user-read-playback-state 
        user-modify-playback-state 
        user-library-modify 
        user-library-read 
        streaming`;

    const authUrl = ('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: STATE
        }));
    return sendRedirect(event, authUrl)

})
