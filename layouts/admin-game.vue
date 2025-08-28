<template>
    <div class="layout-user-game w-full h-full position-relative">
        <div data-v-988cf56d="" class="video-container position-fixed top-0 left-0 w-screen h-screen z-[-1]">
            <!-- <video autoplay="" loop="" muted><source src="https://namdv-storage.s3.ap-southeast-2.amazonaws.com/conversation/HAPPY.mp4" type="video/mp4">
                Your browser does not support the video tag. 
            </video> -->
            <img :src="currentBg" alt="background" class="bg-admin-layout">
        </div>
        <AdminGameHeader :code="code" class="position-absolute top-0 w-full" @change-background="changeBackgroundImg" />
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BG_DEFAULT, USER_PROFILE_KEY_NAME } from "~/constants/application";
import CookieManager from "~/utils/cookies";
import { useMainStore } from "~/store";
import { watch } from 'vue'

export default defineComponent({
    components: {
    },
    setup(props) {
        const appStore = useMainStore();
        const code = ref<number>(0);
        const currentBg = ref<string>(BG_DEFAULT[0].link);
        const listBg = ref<any[]>(BG_DEFAULT);

        const changeBackgroundImg = (params: { name: string, link: string }) => {
            CookieManager.setCookie(USER_PROFILE_KEY_NAME + "_bg_admin", params.name);
            currentBg.value = params.link;
        }

        const setBackground = () => {
            const bg = CookieManager.getCookie(USER_PROFILE_KEY_NAME + "_bg_admin");
            if (bg) {
                currentBg.value = listBg.value.find((item) => item.name === bg)?.link || listBg.value[0].link;
            }
        }

        watch(
            () => appStore.$state.bgSelected,
            (newVal, oldVal) => {
                if (newVal.link) {
                    const newBg = [{
                        name: newVal.name,
                        link: newVal.link
                    }];
                    listBg.value = [...newBg, ...BG_DEFAULT];
                    setBackground();
                }
            }
        )

        onMounted(() => {
            setBackground();
        });

        return {
            code,
            changeBackgroundImg,
            currentBg,
        };
    },
});
</script>

<style scoped>
.bg-admin-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>