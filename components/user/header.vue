<template>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#006d77">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">
                <svg data-v-4308d67f="" xmlns="http://www.w3.org/2000/svg" width="48" viewBox="0 0 48 48" fill="none">
                    <path data-v-4308d67f="" fill-rule="evenodd" clip-rule="evenodd"
                        d="M13.3449 13.2828C18.8747 7.81584 27.7905 7.83364 33.2963 13.3394C37.5093 17.5524 38.5091 23.7594 36.2989 28.92C36.1615 29.241 35.9707 29.5166 35.7429 29.7444C34.7587 30.7286 33.0857 30.8064 32.0179 29.7388C31.2529 28.9736 31.0011 27.8166 31.4253 26.8212C32.8015 23.5982 32.1749 19.7218 29.5445 17.0914C26.1007 13.6476 20.5241 13.6402 17.0669 17.063C13.6441 20.5202 13.6515 26.0968 17.0953 29.5406C19.7257 32.171 23.6021 32.7976 26.8251 31.4214C27.8207 30.9972 28.9775 31.249 29.7425 32.014C30.8103 33.0818 30.7325 34.7548 29.7483 35.739C29.5205 35.9666 29.2449 36.1578 28.9239 36.295C23.7633 38.5052 17.5563 37.5054 13.3435 33.2924C7.83752 27.7868 7.81972 18.8708 13.2867 13.341L13.2853 13.3394C13.2949 13.3296 13.3053 13.3208 13.3151 13.3112C13.3247 13.3014 13.3337 13.2912 13.3435 13.2814L13.3449 13.2828Z"
                        fill="white"></path>
                    <path data-v-4308d67f="" fill-rule="evenodd" clip-rule="evenodd"
                        d="M37.8628 37.859C36.6044 39.1174 34.5638 39.1174 33.3054 37.859C32.0468 36.6004 32.0468 34.56 33.3054 33.3016C34.5638 32.043 36.6044 32.043 37.8628 33.3016C39.1212 34.56 39.1212 36.6004 37.8628 37.859Z"
                        fill="white"></path>
                </svg>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item ms-2">
                        <img src="../../public/mario_icon.png" width="35" height="35" />
                    </li>
                    <li class="nav-item ms-2">
                        <a class="nav-link btn btn-outline-success">Join</a>
                    </li>
                    <li class="nav-item ms-2">
                        <a class="nav-link btn btn-outline-success">Dashboard</a>
                    </li>
                </ul>
            </div>
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
    background-image: linear-gradient(rgb(151, 80, 137) 0%, rgb(19, 2, 18) 100%);
}
</style>
