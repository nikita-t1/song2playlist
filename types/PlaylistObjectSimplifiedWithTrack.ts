type PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
type PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

export interface PlaylistObjectSimplifiedWithTrack extends PlaylistObjectSimplified {
    allTracks: PlaylistTrackObject[]
}
