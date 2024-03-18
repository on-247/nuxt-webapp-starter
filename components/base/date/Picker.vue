<script setup lang="ts">
interface Emits {
    (e: 'update:modelValue', payload: string): void;
}
interface Props {
    modelValue: string
}
const emit = defineEmits<Emits>()
const prop = defineProps<Props>()

const dayNames = {
    0: 'ma',
    1: 'di',
    2: 'wo',
    3: 'do',
    4: 'vr',
    5: 'za',
    6: 'zo'
}
const monthNames: Record<number, string> = {
    0: 'jan',
    1: 'feb',
    2: 'mrt',
    3: 'apr',
    4: 'mei',
    5: 'jun',
    6: 'jul',
    7: 'aug',
    8: 'sep',
    9: 'okt',
    10: 'nov',
    11: 'dec',
}

const date = new Date()
const yearIndex = ref(date.getFullYear())
const monthIndex = ref(date.getMonth())
const minDate = computed(() => {
    let firstDate = new Date(yearIndex.value, monthIndex.value, 1),
        day = firstDate.getUTCDay()
    return day == 1
        ? firstDate
        : copy(firstDate, {
            date: firstDate.getDate() - day
        })
})
const maxDate = computed(() => {
    let lastDate = new Date(yearIndex.value, monthIndex.value + 1, 0),
        day = lastDate.getUTCDay()
    return day == 0
        ? lastDate
        : copy(lastDate, {
            date: lastDate.getDate() + (6 - day)
        })
})
const selected = computed(() => {
    let [year, month, date] = prop.modelValue.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
})
const days = computed(() =>
{
    let days = []
    let next = minDate.value
    for (let i=0;i<999;i++) {
        days.push({
            inRange: next.getMonth() == monthIndex.value,
            date: copy(next, {}),
            isToday: compare(date, next)
        })
        if (compare(next, maxDate.value)) {
            break
        }
        next = copy(next, {
            date: next.getDate() + 1,
        })
    }
    return days
})
const copy = (
    date: Date,
    {
        year,
        month,
        date: newDate
    }: {
        year?: number,
        month?: number,
        date?: number
    }
) => {
    return new Date(
        year || date.getFullYear(),
        month || date.getMonth(),
        newDate || date.getDate()
    )
}
const compare = (
    date: Date,
    date2: Date
) => {
    return (
        (date.getFullYear() == date2.getFullYear())
        && (date.getMonth() == date2.getMonth())
        && (date.getDate() == date2.getDate())
    )
}
const prevMonth = () => {
    if (monthIndex.value - 1 < 0) {
        monthIndex.value = 11
        yearIndex.value -= 1
        return
    } 
    monthIndex.value -= 1
}
const nextMonth = () => {
    if (monthIndex.value + 1 > 11) {
        monthIndex.value = 0
        yearIndex.value += 1
        return
    }
    monthIndex.value += 1
}
const selectDate = (date: Date) => {
    emit('update:modelValue', `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
} 
onMounted(() => {
    if (!prop.modelValue) selectDate(date)
})
</script>

<template>
    <div>
        <!-- Calendar Head -->
        <div class="flex justify-between items-center mb-4">
            <Icon
                name="chevron-left"
                @click="prevMonth"
            />
            <div class="flex justify-center gap-2">
                <div>{{yearIndex}}</div>
                <div>{{monthNames[monthIndex]}}</div>
            </div>
            <Icon
                name="chevron-right"
                @click="nextMonth"
            />
        </div>
        <!-- End Calendar Head -->
        <!-- Calendar Days -->
        <div class="grid grid-cols-[repeat(7,1fr)]">
            <div
                v-for="day, index in dayNames"
                class="text-slate-500 px-1 py-2 text-center"
                :key="`header_${index}`"
            >
                {{ day }}
            </div>
            <!--  -->
            <div
                v-for="day, i in days"
                :key="i"
                :class="[
                    'px-1 py-2 text-center', {
                        'text-slate-700': !day.inRange,
                        'bg-zinc-700 rounded-md': compare(day.date, selected),
                        'text-amber-400': compare(day.date, date),
                    }]"
                @click="() => day.inRange && selectDate(day.date)"
            >
                {{ day.date.getDate() }}
            </div>
        </div>
        <!-- End Calendar Days -->
    </div>
</template>