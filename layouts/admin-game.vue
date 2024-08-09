<template>
    <div class="layout-user-game w-full h-full position-relative">
        <div data-v-988cf56d="" class="video-container fixed top-0 left-0 w-screen h-screen z-[-1]">
            <video autoplay="" loop="" muted><source src="https://cf.quizizz.com/themes/synthwave/bg_video.mp4" type="video/mp4">
                Your browser does not support the video tag. 
            </video>
        </div>
        <AdminGameHeader class="position-absolute top-0 w-full" />
        <slot />
    </div>
</template>
  
<script lang="ts">

export default {
    components: {

    }
}
</script>

<style scoped>

</style>
  