<script setup lang="ts">
onMounted(() => useScroll().init());
onBeforeUnmount(() => useScroll().destroy());
</script>

<template>
    <ClientOnly>
        <main>
            <p>Error</p>
            <p>{{ useError().value?.message }}</p>
        </main>
        <Footer />
    </ClientOnly>
</template>