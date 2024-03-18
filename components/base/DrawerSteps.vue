<script setup lang="ts">
import type DrawerStepsIndicatorVue from './DrawerStepsIndicator.vue';

interface Emits {
    (e: 'complete', data: Record<string, any>): void;
}
interface Props {
    steps: {
        render: any;
        title: string;
        subtitle?: string;
    }[]
}

type Data = Record<string, any>

const emit = defineEmits<Emits>()
const prop = defineProps<Props>()
const wrapper = ref()
const index = ref(0)
const limit = computed(() => (wrapper.value?.children?.length ?? 1) - 1)
const collectiveData: Ref<Record<string, any>> = ref({})
const step = computed(() => prop.steps[index.value])
const translateWrapper = computed(() => `translatex(-${index.value * 100}%)`)
const setData = (data: Data) => {
    for (const [k, v] of Object.entries(data)) {
        collectiveData.value[k] = v
    }
}
const prev = () => {
    if (index.value - 1 < 0) return
    else index.value -= 1
}
const next = (data: Data) => {
    setData(data)
    if (index.value + 1 > limit.value) {
        emit('complete', collectiveData.value)
    }
    else index.value += 1
}
</script>

<template>
    <div class="w-full overflow-x-hidden">
        <div class="w-full flex flex-col items-center py-4 px-[20px]">
            <div class="text-xl font-semibold">{{ step.title }}</div>
            <div
                v-if="step.subtitle"
                class="test-xs text-white/[.5]"
            >
                {{ step.subtitle }}
            </div>
            <BaseDrawerStepsIndicator
                class="mt-4"
                :amount="limit + 1"
                :index="index"
            />
        </div>
        <div
            ref="wrapper"
            class="whitespace-nowrap transition-transform"
            :style="{transform: translateWrapper}"
        >
            <BaseDrawerStep
                v-for="{render} in steps"
            >
                <component
                    :is="render"
                    @prev="prev"
                    @next="next"
                />
            </BaseDrawerStep>
        </div>
        <div
            v-if="index > 0"
            class="flex items-center"
        >
            <button
                type="button"
                class="w-full flex justify-center items-center py-3"
                @click="prev"
            >
                Vorige
            </button>
        </div>
    </div>
</template>