type CurrentUsersProfileResponse = SpotifyApi.CurrentUsersProfileResponse;

export function isUserObject(user: CurrentUsersProfileResponse | {}): user is CurrentUsersProfileResponse {
    return (user as CurrentUsersProfileResponse).id !== undefined;
}
