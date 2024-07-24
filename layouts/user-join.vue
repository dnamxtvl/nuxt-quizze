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
/* Styles riêng cho layout user */
.layout-user {
  background-image: linear-gradient(rgb(146, 14, 134) 0%, rgb(19, 2, 18) 100%) !important;
  background-size: cover;
  background-position: center center;
}
</style>
