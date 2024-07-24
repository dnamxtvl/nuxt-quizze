<template>
    <div class="layout-user-game w-full h-full">
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
/* Styles riêng cho layout user */
.layout-user-game {
    min-height: 970px;
    background-image: url(https://cf.quizizz.com/themes/v2/football/bg_image_1080p.jpg)
}
</style>
  