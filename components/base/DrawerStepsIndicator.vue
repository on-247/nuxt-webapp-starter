<script setup lang="ts">
defineProps(['amount', 'index'])
</script>

<template>
    <div class="flex items-center gap-2">
        <div
            v-for="i in [...Array(amount).keys()]"
            :class="['h-[3px] w-[30px] bg-white/[.1] rounded-full', {'bg-white/[1]': index == i}]"
        />
    </div>
</template>