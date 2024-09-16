<template>
    <div class="layout-user-game w-full">
        <UserGameHeader />
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
.layout-user-game {
    background-image: url(https://cf.quizizz.com/themes/v2/football/bg_image_1080p.jpg);
    height: calc(100vh + 80px) !important;
}
</style>
  