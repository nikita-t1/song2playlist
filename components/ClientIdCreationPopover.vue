<script lang="ts" setup>
defineProps({
    callbackUrl: {
        required: true,
        type: String
    }
})
</script>

<template>
    <div class="px-3 py-2 border-b rounded-t-lg border-gray-600 bg-neutral-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">Create a Client ID</h3>
    </div>
    <div class="px-3 py-2">
        The following steps are required to get started:
        <ol class="list-decimal ps-4">
            <li>
                <p>Log into the
                    <a class="text-spotify-green hover:text-spotify-green-lighter"
                       href="https://developer.spotify.com/dashboard" target="_blank">dashboard</a>
                    using your Spotify account
                </p>
            </li>
            <li>
                <a class="text-spotify-green hover:text-spotify-green-lighter"
                   href="https://developer.spotify.com/documentation/web-api/concepts/apps"
                   target="_blank">Create an App</a>
                <ol class=" list-disc list-outside ps-6 pb-1">
                    <li>
                        <p class="text-gray-400 dark:text-gray-300">Set the Redirect URI to
                            <Keyboard :text="callbackUrl"/>
                        </p>
                    </li>
                </ol>
            </li>
            <li>
                <p>Copy the Client ID from the App Overview</p>
            </li>
        </ol>
    </div>
</template>

<style scoped>

</style>
