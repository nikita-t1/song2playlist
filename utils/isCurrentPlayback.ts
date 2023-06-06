import CurrentPlaybackResponse = SpotifyApi.CurrentPlaybackResponse;

export function isCurrentPlayback(playback: CurrentPlaybackResponse | null): playback is CurrentPlaybackResponse {
    return (playback as CurrentPlaybackResponse).is_playing !== undefined;
}
