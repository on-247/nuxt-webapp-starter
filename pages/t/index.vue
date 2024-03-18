<script setup lang="ts">
import {Filter, Sorts} from '~/lib/api'

import {
    type User,
    type Tool,
    type ToolActivityUpdate
} from '~/types'

import {toolGroupNameSort, toolUserActivitySort} from '~/lib/sorting'

type ToolGroups = Record<string, {
    tools: Tool[]
}>

const client = useAPI()
const localStorage = useLocalStorage()
const state = useState<any>('group')

const userFilter: any = ref(null)
const tools: Ref<Tool[]> = ref([])

// Returns all group members
const users = computed(() => {
    return Object.entries(state.value.users ?? []).map(entry => entry[1])
}) as ComputedRef<User[]>

const toolGroups = computed(() => {
    let groups: ToolGroups = {default: {tools: []}}
    // Assemble groups and sort alphabetically
    for (const tool of tools.value)
        if (
            tool.last_activity?.location?.name
            && !(tool.last_activity.location.name in groups)
        ) {
            groups[tool.last_activity.location.name] = {tools: []}
            continue;
        }
    groups = Object.fromEntries(
        toolGroupNameSort(Object.keys(groups)).map(groupName => [groupName, {tools: []}])
    )
    // Add tools per group
    for (const tool of tools.value) {
        if (!tool.last_activity || !tool.last_activity.location.name) {
            groups.default.tools.push(tool)
            continue;
        }
        groups[tool.last_activity.location.name].tools.push(tool)
    }
    // Sort grouped tools
    for (const groupName in groups)
        groups[groupName].tools = toolUserActivitySort(groups[groupName].tools, localStorage.userId)
    // Return grouped and sorted tools
    return groups
})

const groupUpdates: Ref<ToolActivityUpdate[]> = ref([])

const toggleFilter = async () => {
    userFilter.value = userFilter.value
        ? null
        : Filter.contains('users', localStorage.userId)

    await getTools([userFilter.value])
}

const toggleViewType = (vt: string) => {
    localStorage.toolViewType = vt === 'list'
        ? 'list'
        : 'grid'
}

const getTools = async (filters: any[] = []) => {
    tools.value = await client.tool.paginate({
        sorts: Sorts.create({id: 'desc'}),
        filters: [
            Filter.eq('group_id', state.value.id),
            ...filters.filter(f => !!f)
        ]
    })
}

onMounted(async () => await getTools())
</script>

<template>
    <div
        v-if="state.loaded"
        class="h-full overflow-y-auto"
    >
        <BaseUserGroupInfo
            :name="state.name"
            :users="users"
            class="pt-4 px-[20px]"
        />
        <!--  -->
        <div class="flex justify-between px-[20px] pb-4 mt-12">
            <Icon
                name="plus"
                :sizes="24"
                @click="useDrawerActivate('tool.create')"
            />
            <!--  -->
            <div class="flex gap-4">
                <Icon
                    name="list"
                    :sizes="24"
                    :class="{'text-gray/[.44]': localStorage.toolViewType  === 'grid'}"
                    @click="toggleViewType('list')"
                />
                <Icon
                    name="grid"
                    :sizes="24"
                    :class="{'text-gray/[.44]': localStorage.toolViewType  === 'list'}"
                    @click="toggleViewType('grid')"
                />
                <!--  -->
                <Icon
                    name="filter"
                    :sizes="24"
                    :class="{'text-gray/[.44]': !userFilter}"
                    @click="toggleFilter"
                />
            </div>
        </div>
        <!--  -->
        <main class="w-full flex flex-col  gap-8 px-[20px] pb-4 mt-12">
            <ModuleToolGroup
                v-for="{tools}, name in toolGroups"
                :group="{name, tools}"
                @update="getTools"
            />
        </main>
    </div>
</template>