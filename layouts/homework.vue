<template>
    <div class="layout-homework w-full h-full">
        <UserGameHeader class="bg-primary" />
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
.layout-homework {
    background-color: #eaf0ff;
    height: calc(100vh + 80px) !important;
}
</style>
  