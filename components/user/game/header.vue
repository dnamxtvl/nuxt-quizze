<template>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#006d77">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white" href="#">
                <img src="../../../public/mario_icon.png" width="35" height="35" />
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item ms-2 navbar-brand fw-bold btn btn-outline-dark text-white">
                        976349
                    </li>
                    <li class="nav-item ms-2">
                        <a class="nav-link btn btn-danger">Thoát</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script lang="ts">
export default defineComponent({
  name: 'UserGameHeader'
});
</script>
<style scoped>
nav {
    background-color: rgba(0, 0, 0, 1) !important;
    min-height: 80px;
}
</style>
