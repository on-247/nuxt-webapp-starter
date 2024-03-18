export const usePageLoaded = () => {
    const loaded = ref(false);
    const app = useNuxtApp();
    app.hook('page:start', () => {loaded.value = false});
    app.hook('page:finish', () => {
        useScroll().to(0);
        loaded.value = true;
    });

    return {loaded}
}