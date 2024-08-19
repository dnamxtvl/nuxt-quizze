<template>
    <div class="container-fluid w-full h-full body-pre-game">
        <div class="main-action-section row d-flex justify-content-center">
            <div class="col-xl-3 col-md-6 col-lg-6 col-12 mt-24 ps-4 pe-4 form-submit-name">
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label text-white mt-4 fs-6">Tên Quizizz của bạn
                        là...</label>
                    <input type="text" v-model="username" class="form-control input-pre-game" id="exampleFormControlInput1"
                        placeholder="Điền tên của bạn">
                </div>
                <div class="mb-4 w-full">
                    <button @click="createSettingGame" class="btn btn-success w-full input-pre-game fs-5 fw-bold font-600">Bắt đầu</button>
                </div>
            </div>
        </div>
        <div class="main-action-section row d-flex justify-content-center">
            <div class="col-xl-3 col-md-6 col-12 mt-4 ps-4 pe-4 form-submit-name">
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label text-white mt-4 fs-6">Cài đặt</label>
                </div>
                <div class="setting-pregame pt-3 ps-3 pe-3">
                    <div class="mb-4 w-full d-flex justify-content-between">
                        <div>😂 Meme</div>
                        <div>
                            <el-switch
                                v-model="valueEnableMeme"
                                class="ml-2"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            />
                        </div>
                    </div>
                    <div class="mb-4 w-full d-flex justify-content-between pb-2">
                        <div>🎙 Âm thanh</div>
                        <div>
                            <el-switch
                                v-model="valueEnableVolumn"
                                class="ml-2"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElLoading, ElNotification } from "element-plus";
import { useValidator } from "#imports";
import { RULES_VALIDATION } from "~/constants/application";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import { useMainStore } from "~/store";
import type { ErrorResponse } from "~/constants/type";

export default defineComponent({
  setup() {
    const valueEnableMeme = ref<boolean>(false);
    const valueEnableVolumn = ref<boolean>(false);
    const username = ref<string >('');
    const route = useRoute();
    const store = useMainStore();

    const createSettingGame = async () => {
        ElLoading.service({ fullscreen: true });
        const validator = useValidator();
        const isUserNameLength = validator.isLength(username.value, 'username', RULES_VALIDATION.USERNAME_LENGTH.MIN, RULES_VALIDATION.USERNAME_LENGTH.MAX);
        if (isUserNameLength !== true) {
            ElLoading.service({ fullscreen: true }).close();
            ElNotification({title: "Error", message: isUserNameLength, type: "error"});
            return;
        }
        
        await api.gamer.createSetting(
            {name: username.value, display_meme: valueEnableMeme.value, token: route.params.tokenId, gamer_id: store.$state.gamerId},
            (res: any) => {
                ElLoading.service({ fullscreen: true }).close();
                return navigateTo("/user/join/game/" + route.params.tokenId);
            },
            (err: ErrorResponse) => {
                ElLoading.service({ fullscreen: true }).close();
                ElNotification({title: "Error", message: err.error.shift(), type: "error"});
            }
        )
    }

    onMounted(async () => {
    });

    return {
        valueEnableMeme,
        valueEnableVolumn,
        username,
        createSettingGame,
    }
  }
})
</script>
<style scoped>
.body-pre-game {
    background-color: #000;
    min-height: 100vh;
}
.input-pre-game {
    min-height: 3rem;
}
.form-submit-name {
    background-color: rgba(9, 9, 9, 1);
    border-radius: 1rem;
}
.setting-pregame {
    background-image: linear-gradient(#ffffff14, #ffffff0a);
    border-radius: 1rem;
}
</style>