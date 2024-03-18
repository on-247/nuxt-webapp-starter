<script setup lang="ts">
interface Emits {
    (e: 'update:modelValue', payload: {min: Date, max: Date}): void;
}

interface Props {
    modelValue: {min: Date, max: Date}
}

const emits = defineEmits<Emits>()
defineProps<Props>()

const currentDate = new Date()
const monthNames = [
    'jan',
    'feb',
    'mar',
    'apr',
    'mei',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec'
]
const year = ref(currentDate.getFullYear())
const monthIndex = ref(currentDate.getMonth())

const min = computed(() => new Date(year.value, monthIndex.value, 1))
const max = computed(() => new Date(year.value, monthIndex.value + 1, 0))

watch([min, max], () => {
    emits('update:modelValue', {min: min.value, max: max.value})
})

const change = (direction: number) => {
    if (direction < 0) {
        if (monthIndex.value - 1 < 0) {
            year.value -= 1
            monthIndex.value = 11
        }
        else monthIndex.value -= 1
    }
    else {
        if (monthIndex.value + 1 > 11) {
            year.value += 1
            monthIndex.value = 0
        }
        else monthIndex.value += 1
    }
}
</script>

<template>
    <div class="flex gap-2 items-center">
        <Icon
            name="chevron-left"
            class="p-4 cursor-pointer"
            @click="change(-1)"
        />
        <div class="w-full flex justify-between">
            <div>{{ min.getDate() }}</div>
            <div>{{ monthNames[monthIndex] }} {{ year }}</div>
            <div>{{ max.getDate() }}</div>
        </div>
        <Icon
            name="chevron-right"
            class="p-4 cursor-pointer"
            @click="change(1)"
        />
    </div>
</template>