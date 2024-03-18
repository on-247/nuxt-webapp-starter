<script setup lang="ts">
const rendered = useDrawerRender()
</script>

<template>
    <BaseDrawer
        v-for="component, renderId in rendered"
        @close="useDrawerDeactivate(renderId)"
    >
        <Component :is="component()" />
    </BaseDrawer>
</template>