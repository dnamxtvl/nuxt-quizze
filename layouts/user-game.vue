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
    /* background-image: url(https://namdv-storage.s3.ap-southeast-2.amazonaws.com/conversation/HAPPY.png); */
    background-image: url(/public/kahoot-background.jpg);
    height: 100vh !important;
    overflow-y: auto;
    object-fit: contain;
}
</style>
  