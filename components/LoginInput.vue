<script setup lang="ts">
import useGenerateRandomString from "~/composable/useGenerateRandomString";
import useGenerateCodeChallenge from "~/composable/useGenerateCodeChallenge";
import {useAuthorizationStore} from "~/stores/useAuthorizationStore";

const authStore = useAuthorizationStore()

const codeVerifier = useGenerateRandomString(128);
const codeChallenge = ref('')
const authUrl = computed(() => ('https://accounts.spotify.com/authorize?' + authArgs.value));
const callbackUrl = ref('');

onMounted(async () => {
    authStore.setCodeVerifier(codeVerifier)
    codeChallenge.value = await useGenerateCodeChallenge(codeVerifier)
    callbackUrl.value = window.location.href.replace('login', 'callback') + "/"
    authStore.setCallbackUrl(callbackUrl.value)
})

const authArgs = computed(() => {
    return new URLSearchParams({
        response_type: 'code',
        client_id: authStore.clientId ?? '',
        scope: scopes,
        redirect_uri: callbackUrl.value,
        state: useGenerateRandomString(16),
        code_challenge_method: 'S256',
        code_challenge: codeChallenge.value,
    });
})

const scopes: string = `
        user-read-private
        playlist-read-private
        playlist-modify-private
        playlist-modify-public
        user-read-playback-state
        user-modify-playback-state
        user-library-modify
        user-library-read
        streaming`;

</script>

<template>
    <div class="w-full max-w-md">
        <h1 class="font-bold text-xl text-white pb-4">Get started</h1>
        <p class="text-gray-400 pb-6">
            Input your
            <Keyboard text="Client_ID"/>
            from your Spotify Developer Account to get started.
        </p>
        <div class="my-6">
            <label class="font-semibold block text-sm  mb-2 dark:text-white" for="input-label">Client_ID</label>
            <input id="input-label" v-model="authStore.clientId"
                   class="py-3 px-4 block w-full rounded-md text-sm dark:bg-neutral-800 dark:border-gray-700 dark:text-white"
                   type="text">
        </div>

        <a :href="authUrl"
           class="w-full text-white  p-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold  bg-spotify-green hover:bg-spotify-green-lighter ">
            <button
                class="grow"
                type="button">
                Login
            </button>
        </a>
    </div>
</template>
