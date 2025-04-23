<template>
    <div class="flex flex-col w-full h-max justify-start items-center animated zoomIn anim-300-duration body-user-join-page">
        <div class="relative flex flex-col justify-start items-center">
            <div class="flex flex-col items-center mt-24 d-flex justify-content-center">
                <span class="text-4xl fs-1 fw-bold font-bold text-white">VibeQuiz!</span>
            </div>
            <div class="row form-submit-join-code mt-24 d-flex justify-content-center ms-2 me-2">
                <form class="flex flex-col items-center mt-8 col-xl-3 col-lg-6 col-md-9 col-12 position-relative" @submit="verifyCode">
                    <input type="number" v-model="code" class="form-control w-1/2 input-text-dress-code-join" placeholder="Enter your code" />
                    <button type="submit" class="btn btn-primary mt-4 font-500 position-absolute me-4 mb-2 right-0 button-join-game">Join</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useValidator } from "#imports";
import { ElNotification } from "element-plus";
import api from "~/api/axios";
import type { ErrorResponse } from "~/constants/type";
import { useMainStore } from "~/store";
import CookieManager from "~/utils/cookies";
import { JWT_KEY_ACEESS_TOKEN_NAME } from "~/constants/application";
import { useRoute } from "vue-router";

definePageMeta({
  layout: 'user-join'
})

export default defineComponent({
  setup() {
    const route = useRoute();
    const code = ref<number | ''>('');
    const store = useMainStore();
    const countReconnected = ref<number>(0);

    const verifyCode = async (e: SubmitEvent) => {
        e.preventDefault();
        ElLoading.service({ fullscreen: true });
        const validator = useValidator();
        if (!validator.isValidCode(code.value?.toString())) {
            ElNotification({title: "Error", message: 'Code phải gồm 6 chữ số!', type: "error"});
            ElLoading.service({ fullscreen: true }).close();
            return;
        }

        await verifyCodeGamer();
    }

    const verifyCodeGamer = async () => {
        await api.room.verifyCode(
            parseInt(code.value?.toString()),
            (res: any) => {
                ElLoading.service({ fullscreen: true }).close();
                store.saveGamerId(store.$state, res.gamer_id);
                CookieManager.setCookie('gamerId' + JWT_KEY_ACEESS_TOKEN_NAME, res.gamer_id);
                return navigateTo("/user/join/pre-game/" + res.token);
            },
            (err: ErrorResponse) => {
                ElLoading.service({ fullscreen: true }).close();
                ElNotification({title: "Error" ,message: err.error.shift(), type: "error"});
            }
        )
    }

    onMounted(async () => {
        countReconnected.value = 0;
        if (route.query.gc) {
            code.value = route.query.gc as number;
            const validator = useValidator();
            if (!validator.isValidCode(code.value?.toString())) {
                ElNotification({title: "Error", message: 'Code phải gồm 6 chữ số!', type: "error"});
                ElLoading.service({ fullscreen: true }).close();
                return;
            }

            ElLoading.service({ fullscreen: true });
            await verifyCodeGamer();
        }

        const { $bus }: any = useNuxtApp();
            $bus.$on('lostConnection', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Error", message: countReconnected.value == 0 ? "Bạn đang offline!" : "Reconnect lần " + countReconnected.value + " thất bại!", type: "error", duration: 0 });
                countReconnected.value = countReconnected.value + 1;
            });

            $bus.$on('reconnected', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Reconected", message: "Đã khôi phục kết nối!", type: "success", duration: 3000 });
                countReconnected.value = 0;
            });

            $bus.$on('lostConnectionEver', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Error", message: "Hãy kiểm tra lại kết nối mạng!", type: "error", duration: 0 });
            })
    });

    return {
        code,
        verifyCode,
        route,
    }
  }
})
</script>
<style scoped>
.button-join-game {
    top: -0.625rem;
    right: 0;
}
.body-user-join-page {
    min-height: 670px;
}
</style>