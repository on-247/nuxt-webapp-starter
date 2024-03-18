<script setup lang="ts">
import {EVENTS_AUTH_UNAUTHENTICATED} from '~/constants'

const client = useAPI()
const events = useEvents()

const localStorage = useLocalStorage()

const loading = ref(true)
const isAuthenticated = ref(false)

const authenticate = async (credentials: Record<string, any>) => {
    try {
        loading.value = true
        const {token} = await client.auth.create(credentials)
        // Set API client token
        client.apiKey = token
        // Save token
        localStorage.token = token
        const claims = await check()
        // Save user ID
        localStorage.userId = claims.sub
        // Mark user as authenticated
        isAuthenticated.value = true
    }
    catch {}
    finally {
        loading.value = false
    }
}

const check = async () => {
    if (!localStorage.token) throw new Error('Token not present')
    return await client.auth.checkToken({})
}

events.on(EVENTS_AUTH_UNAUTHENTICATED, () => {
    isAuthenticated.value = false
})

onMounted(async () => {
    try{
        const claims = await check()
        // Save user ID
        localStorage.userId = claims.sub
        // Mark user as authenticated
        isAuthenticated.value = true
    } catch (e) {}
    finally {
        loading.value = false
    }
})
</script>

<template>
    <div
        v-if="loading"
        class="h-full w-full flex items-center justify-center bg-zinc-900 text-white px-[20px]"
    >
        <div>Loading...</div>
    </div>
    <div
        v-else-if="!isAuthenticated"
        class="h-full w-full flex items-center bg-zinc-900 text-white"
    >
        <div class="max-w-[500px] w-full mx-auto px-[20px]">
            <Form
                submit-label="Login"
                loading-label="Logging in..."
                class="w-full"
                @submit-obj="authenticate"
            >
                <FormInput
                    name="email"
                    type="email"
                    v-model="localStorage.userEmail"
                >
                    E-mail
                </FormInput>
                <FormInput
                    name="passcode"
                    type="password"
                >
                    Passcode
                </FormInput>
            </Form>
        </div>
    </div>
    <slot v-else />
</template>