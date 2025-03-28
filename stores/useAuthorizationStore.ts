import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {type Ref} from "vue";

export const useAuthorizationStore = defineStore('authorizationStore', () => {
    const clientId: Ref<string | null> = useStorage('clientId', null)
    const codeVerifier: Ref<string | null> = useStorage('codeVerifier', null)
    const callbackUrl: Ref<string | null> = useStorage('callbackUrl', null)

    const spotifyAccessToken = useStorage<string>('spotifyToken', '')
    const spotifyRefreshToken = useStorage<string>('spotifyRefreshToken', '')
    const spotifyTokenValidity = useStorage<number>('spotifyTokenValidity', 0)

    function setClientId(newClientId: string) {
        clientId.value = newClientId
    }

    function setCodeVerifier(newCodeVerifier: string) {
        codeVerifier.value = newCodeVerifier
    }

    function setCallbackUrl(newCallbackUrl: string) {
        callbackUrl.value = newCallbackUrl
    }

    return {
        clientId,
        codeVerifier,
        callbackUrl,
        spotifyAccessToken,
        spotifyRefreshToken,
        spotifyTokenValidity,
        setClientId,
        setCodeVerifier,
        setCallbackUrl
    }
})
