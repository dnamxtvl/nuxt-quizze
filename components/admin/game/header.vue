<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white" href="#">
                <img src="../../../public/mario_icon.png" width="40" height="40" />
                <span class="ms-1 pt-2 fw-bold fs-3">VibeQuiz</span>
            </a>
            <audio controls autoplay class="d-none" loop :src="music">
              Your browser does not support the audio element.
            </audio>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item me-2">
                        <el-dropdown trigger="click">
                            <span class="text-white btn button-change-option button-change-theme"><i class="fa fa-palette me-1"></i>
                                Chủ đề
                            </span>
                            <template #dropdown>
                              <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in BG_DEFAULT" :key="index" @click="changeBackground(item.name, item.link)">
                                    <div class="row justify-content-between">
                                        <div class="col-4">
                                            <img :src="item.link" width="40" height="40" class="rounded-circle" />
                                        </div>
                                        <div class="col-6 pt-2 text-center" style="width: 70px">{{ item.name }}</div>
                                        <div class="col-2 pt-2 text-center pe-4">
                                            <input class="form-check-input cursor-pointer" type="radio" :value="item.name" v-model="bgSelected" />
                                        </div>
                                    </div>
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </template>
                          </el-dropdown>
                    </li>
                    <li class="nav-item me-2">
                        <el-dropdown trigger="click">
                            <span class="text-white btn button-change-option button-change-music"><i class="fa fa-volume-up"></i>
                            </span>
                            <template #dropdown>
                              <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in MUSIC_DEFAULT" :key="index" @click="changeMusic(item.link)">
                                    <div class="row justify-content-between">
                                        <div class="col-6 pt-2" style="width: 140px">{{ item.name }}</div>
                                        <div class="col-2 pt-2 text-center pe-4">
                                            <input class="form-check-input cursor-pointer" type="radio" :value="item.link" v-model="music" />
                                        </div>
                                    </div>
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </li>
                    <div class="line-vertical-header"></div>
                    <li class="nav-item">
                        <button @click="showModalEndGame()" class="nav-link btn btn-danger text-white">Kết thúc</button>
                    </li>
                </ul>
            </div>
            <el-dialog v-model="centerDialogVisible" :close-on-click-modal="false" title="Warning" width="500" align-center>
                <span>Bạn có chắc chắn muốn kết thúc màn chơi?</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">Đóng</el-button>
                        <el-button type="primary" @click="outGame()">
                            Xác nhận
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </nav>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useRoute as useNuxtRoute } from 'nuxt/app'
import api from "~/api/axios";
import API_CONST from "~/utils/apiConst";
import type { ErrorResponse } from "~/constants/type";
import { BG_DEFAULT, MUSIC_DEFAULT, USER_PROFILE_KEY_NAME } from "~/constants/application";
import CookieManager from "~/utils/cookies";

export default defineComponent({
    name: 'AdminGameHeader',
    props: {
        code: {
            type: Number,
            required: true,
        },
    },
    setup(props, { emit }) {
        const route = useRoute();
        const centerDialogVisible = ref<boolean>(false);
        const bgSelected = ref<string>(BG_DEFAULT[0].name);
        const music = ref<string>('');

        const outGame = async () => {
            if (route.path.includes(API_CONST.FRONT_END.ADMIN_GAME)) {
                await api.room.adminEndGame(
                    route.params.roomId.toString(),
                    (res: any) => {
                        navigateTo("/admin/dashboard/reports/" + useNuxtRoute().params.roomId);
                    },
                    (err: ErrorResponse) => {
                        ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    }
                );
            }
        }

        const showModalEndGame = () => {
            centerDialogVisible.value = true;
        }

        const changeBackground = (name: string, link: string) => {
            bgSelected.value = name;
            emit('change-background', { name, link });
        }

        const changeMusic = (link: string) => {
            music.value = link;
        }

        onMounted(() => {
            const bg = CookieManager.getCookie(USER_PROFILE_KEY_NAME + "_bg_admin");
            if (bg) {
                bgSelected.value = bg;
            }
        });

        return {
            code: props.code,
            centerDialogVisible,
            showModalEndGame,
            outGame,
            BG_DEFAULT,
            MUSIC_DEFAULT,
            bgSelected,
            changeBackground,
            changeMusic,
            music,
        };
    },
});
</script>
<style scoped>
nav {
    background-color: #090909cc !important;
    min-height: 80px;
}

.button-change-option {
    background-color: #fff3;
    font-size: 14px;
    border: 1px solid #fff3;
    padding-left: 10px;
    padding-right: 10px;
}

.line-vertical-header {
    width: 1px;
    height: 38px;
    background-color:dodgerblue;
    margin-right: 10px;
}
</style>
