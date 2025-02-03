<template>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#006d77">
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
                    <li class="nav-item nav-itenm-theme">
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
                    <li class="nav-item nav-itenm-theme">
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
                    <li class="nav-item nav-itenm-theme">
                        <button @click="outGame" class="nav-link btn btn-danger btn-out-game">Thoát</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script lang="ts">
import { useRoute } from "vue-router";
import api from "~/api/axios";
import API_CONST from "~/utils/apiConst";
import type { ErrorResponse } from "~/constants/type";
import { BG_DEFAULT, MUSIC_DEFAULT } from "~/constants/application";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default defineComponent({
  name: 'UserGameHeader',
  setup(props, { emit }) {
    const route = useRoute();
    const bgSelected = ref<string>(BG_DEFAULT[0].name);
    const music = ref<string>('');

    const outGame = async () => {
        if (route.path.includes(API_CONST.FRONT_END.USER_GAME) || route.path.includes(API_CONST.FRONT_END.HOMEWORK)) {
            await api.gamer.outGame(
                route.params.tokenId.toString(),
                (res: any) => {
                    navigateTo("/user/join");
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            );
        }
    }

    const changeBackground = (name: string, link: string) => {
        bgSelected.value = name;
        emit('change-background', { name, link });
    }

    const changeMusic = (link: string) => {
        music.value = link;
    }
    
    return {
        outGame,
        changeBackground,
        changeMusic,
        bgSelected,
        music,
        BG_DEFAULT,
        MUSIC_DEFAULT,
    }
  }
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

@media screen and (max-width: 992px) {
    .line-vertical-header {
        display: none;
    }

    .nav-itenm-theme {
        display: flex;
        justify-content: center;
        margin-right: 0 !important;
        margin-top: 0.5rem;
    }

    .btn-out-game {
        width: 20%;
    }
}

@media screen and (min-width: 992px) {
    .nav-itenm-theme {
        margin-right: 0.5rem;
    }
}

.line-vertical-header {
    width: 1px;
    height: 38px;
    background-color:dodgerblue;
    margin-right: 10px;
}
</style>
