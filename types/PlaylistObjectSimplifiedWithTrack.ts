import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

export interface PlaylistObjectSimplifiedWithTrack extends PlaylistObjectSimplified {
    allTracks: PlaylistTrackObject[]
}
