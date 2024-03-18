<script setup lang="ts">
import {EVENTS_ACTIVITY_CREATE} from '~/constants'
import {Sorts} from '~/lib/api'
import {type Tool, type ToolActivity} from '~/types'

const client = useAPI()
const state = useState<any>('group')
const toolId = useRoute().params.id

const tool: Ref<Tool | null> = ref(null)
const activity: Ref<ToolActivity[]> = ref([])
const loaded = ref(false)

const users = computed(() => tool.value?.users?.map(id => state.value.users[id]) || [])

const user = computed(() => {
    return tool.value?.last_activity?.occupied_by?.id == null
        ? null
        : state.value.users[tool.value.last_activity.occupied_by.id]
})

onMounted(async () => {
    tool.value = await client.tool.get({
        id: toolId
    })

    activity.value = await client.tool.activity.paginate({
        id: toolId,
        sorts: Sorts.create({id: 'desc'})
    })

    loaded.value = true
})

useEvents().on(
    EVENTS_ACTIVITY_CREATE,
    (newActivity: ToolActivity) => {
        if (tool.value) {
            tool.value.last_activity = newActivity
        }
        activity.value.unshift(newActivity)
    }
)
</script>

<template>
    <div
        v-if="state.loaded && loaded && tool"
        class="w-full h-full flex flex-col"
    >
        <header class="flex justify-between px-[20px] py-4">
            <NuxtLink
                to="/t"
                class="flex items-center gap-2"
            >
                <Icon name="chevron-left" />
                Terug
            </NuxtLink>
            <div></div>
        </header>
        <!--  -->
        <main class="w-full h-full flex flex-col overflow-y-auto">
            <!--  -->
            <div class="flex items-end gap-4 px-[20px] pb-4">
                <ImageLazy
                    :data-src="tool.thumbnail_url"
                    class="w-[40%] object-fit"
                />
                <div class="w-[60%] flex flex-col gap-2">
                    <div class="flex gap-4 items-start text-xl leading-none">
                        <div class="text-ttsm">{{ tool.name }}</div>
                        <div class="flex items-center gap-1">
                            <Icon
                                name="tag"
                                :sizes="14"
                                class="text-gray/[.5]"
                            />
                            <BaseUserInitials
                                :users="users"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!--  -->
            <div class="sticky top-0 z-10 flex items-center gap-4 bg-white px-[20px] pb-4">
                <ModulePowerButton
                    :last-activity="tool.last_activity"
                />
                <ModuleLocationIndicator
                    :status="tool.last_activity?.status"
                    :user="user"
                    :name="tool.last_activity?.location.name"
                />
            </div>
            <!--  -->
            <div class="relative grow w-full bg-lightGray divide-y divide-gray/[.44]">
                <div
                    v-if="!activity.length"
                    class="px-[20px] py-4"
                >
                    Nog geen activiteit
                </div>
                <!--  -->
                <ModuleActivityListItem
                    :="activity[0]"
                    class="opacity-[.5]"
                />
                <ModuleActivityListItem
                    v-for="toolActivity in activity.slice(1)"
                    :="toolActivity"
                />
            </div>
        </main>
    </div>
</template>