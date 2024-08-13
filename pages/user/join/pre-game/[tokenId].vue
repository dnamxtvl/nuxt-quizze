<template>
    <div class="container-fluid w-full h-full body-pre-game">
        <div class="main-action-section row d-flex justify-content-center">
            <div class="col-xl-3 col-md-6 col-lg-6 col-12 mt-24 ps-4 pe-4 form-submit-name">
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label text-white mt-4 fs-6">Tên Quizizz của bạn
                        là...</label>
                    <input type="email" class="form-control input-pre-game" id="exampleFormControlInput1"
                        placeholder="Điền tên của bạn">
                </div>
                <div class="mb-4 w-full">
                    <button class="btn btn-success w-full input-pre-game fs-5 fw-bold font-600">Bắt đầu</button>
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

export default defineComponent({
  setup() {
    const valueEnableMeme = ref<boolean>(false);
    const valueEnableVolumn = ref<boolean>(false);

    onMounted(async () => {
    });

    return {
        valueEnableMeme,
        valueEnableVolumn
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