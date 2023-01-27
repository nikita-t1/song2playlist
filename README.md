# song2playlist
```song2playlist``` helps to manage tracks across different playlists

If you have many playlists (for different moods/genres/decades) it can be cumbersome to manually add tracks to a playlist...  

You have to 
1. ```Right Click on the Track```
2. Select ```Add to Playlist```
3. Then find the Playlist in a long List
4. And if you are unlucky, a Popup will appear with the Message that the Track already is part of the Playlist

Wouldn't it be great to be able to instantly see which playlists a track is part of and quickly add/remove the track from a playlist

## Development Server

Make sure to install the dependencies:
```bash
npm install
```
Provide the following Environment Variables, which you can get trough [Spotify](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)
```dotenv
CLIENT_ID=
CLIENT_SECRET=
```
Start the development server on http://localhost:3000

```bash
npm run dev
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
