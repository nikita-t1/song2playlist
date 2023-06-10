
export default async function useGenerateCodeChallenge(codeVerifier: string) {
    function base64encode(string: Iterable<number> | ArrayBuffer) {
        // @ts-ignore
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}
