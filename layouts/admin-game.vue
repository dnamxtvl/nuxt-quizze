<template>
    <div class="layout-user-game w-full h-full position-relative">
        <div data-v-988cf56d="" class="video-container position-fixed top-0 left-0 w-screen h-screen z-[-1]">
            <video autoplay="" loop="" muted><source src="https://cf.quizizz.com/themes/synthwave/bg_video.mp4" type="video/mp4">
                Your browser does not support the video tag. 
            </video>
        </div>
        <AdminGameHeader :code="code" class="position-absolute top-0 w-full" />
        <slot />
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    components: {
    },
    setup(props) {
        const code = ref<number>(0);
        onMounted(() => {});

        return {
            code
        };
    },
});
</script>

<style scoped>

</style>
  