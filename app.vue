<script setup lang="ts">
const events = useEvents()
const localStorage = useLocalStorage(() => ({
    token: null,
    userEmail: null,
    userId: null,
}))

useAPI({
    baseUrl: useRuntimeConfig().public.apiBaseUrl,
    apiKey: useLocalStorage()?.token,
    events
})

useDrawerRegister([])

const logOut = () => {
    localStorage.token = null
    window.location.reload()
}
</script>

<template>
    <ClientOnly>
        <Auth>
            <Group>
                <div class="w-full h-full flex flex-col">
                    <!--  -->
                    <div class="grow w-full overflow-hidden">
                        <NuxtPage />
                    </div>
                    <!--  -->
                    <div class="w-full flex justify-between items-center bg-[#92FF5F]">
                        <Icon
                            name="logo-long"
                            class="w-fit p-3"
                            :sizes="{
                                width: 150,
                                height: 40
                            }"
                        />
                        <!--  -->
                        <button
                            type="button"
                            class="p-3 text-gray/[.5]"
                            @click="logOut"
                        >
                            <Icon name="log-out" />
                        </button>
                    </div>
                </div>
            </Group>
        </Auth>
        <DrawerRenderer />
    </ClientOnly>
</template>