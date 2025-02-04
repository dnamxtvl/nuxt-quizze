<template>
    <div class="layout-user-game" :style="{ backgroundImage: `url(${currentBg})` }">
        <UserGameHeader  @change-background="changeBackgroundImg"/>
        <slot />
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BG_DEFAULT, USER_PROFILE_KEY_NAME } from "~/constants/application";
import CookieManager from "~/utils/cookies";

export default defineComponent({
    components: {
    },
    setup(props) {
        const code = ref<number>(0);
        const currentBg = ref<string>(BG_DEFAULT[0].link);

        const changeBackgroundImg = (params: { name: string, link: string }) => {
            CookieManager.setCookie(USER_PROFILE_KEY_NAME + "_bg_user", params.name);
            currentBg.value = params.link;
        }

        const setBackground = () => {
            const bg = CookieManager.getCookie(USER_PROFILE_KEY_NAME + "_bg_user");
            if (bg) {
                currentBg.value = BG_DEFAULT.find((item) => item.name === bg)?.link || BG_DEFAULT[0].link;
            }
        }

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
.layout-user-game {
    margin: 0;
    padding: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    height: 100vh;
}
</style>
  