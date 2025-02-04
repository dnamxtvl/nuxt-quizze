<template>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#006d77">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white" href="#">
                <img src="../../public/mario_icon.png" width="40" height="40" />
                <span class="ms-1 pt-2 fw-bold fs-3">VibeQuiz</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
</template>
<script lang="ts">
export default defineComponent({
  name: 'UserHeader'
});
</script>
<style scoped>
nav {
    background-image: url('/public/background-join.png') !important;
}
</style>
