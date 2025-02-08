<template>
  <div class="layout-user w-full h-full">
    <UserHeader />
    <slot />
    <UserFooter />
  </div>
</template>

<script lang="ts">
import UserHeader from '~/components/user/header.vue';

export default {
  components: {
    
  }
}
</script>

<style scoped>
.layout-user {
  background-image: url('/public/background-join.png') !important;
  background-size: cover;
  background-position: center center;
  height: 100vh;
}
</style>
