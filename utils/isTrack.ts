type TrackObjectFull = SpotifyApi.TrackObjectFull;
type EpisodeObject = SpotifyApi.EpisodeObject;

export function isTrack(track: TrackObjectFull | EpisodeObject | null): track is TrackObjectFull {
    return (track as TrackObjectFull).track_number !== undefined;
}
