<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white" href="#">
                <img src="../../../public/mario_icon.png" width="35" height="35" />
                <svg data-v-f6e563ba="" xmlns="http://www.w3.org/2000/svg" width="80%" height="40" viewBox="0 0 120 40"
                    fill="none" class="ml-1">
                    <path fill="#fff" fill-rule="evenodd"
                        d="M29.195 9.34c-5.506-5.506-14.422-5.524-19.952-.057l-.001-.001-.016.016-.013.013a.522.522 0 0 1-.013.013l-.016.016.001.001c-5.467 5.53-5.45 14.446.057 19.952 4.213 4.213 10.42 5.212 15.58 3.002.321-.137.597-.328.825-.556a2.638 2.638 0 0 0-.006-3.725c-.765-.765-1.922-1.017-2.917-.592a8.848 8.848 0 0 1-9.73-1.881c-3.444-3.444-3.452-9.02-.029-12.478 3.457-3.423 9.034-3.415 12.478.029a8.848 8.848 0 0 1 1.88 9.73c-.424.995-.172 2.152.593 2.917a2.639 2.639 0 0 0 3.725.006c.228-.228.419-.504.556-.825 2.21-5.16 1.21-11.367-3.002-15.58Zm.009 24.52A3.223 3.223 0 1 0 33.76 29.3a3.223 3.223 0 0 0-4.557 4.558Zm6.042-20.934c0-1.433.874-2.48 2.306-2.48 1.362 0 2.375 1.082 2.375 2.48v8.908c0 2.061 1.293 3.249 3.354 3.249 1.293 0 2.445-.315 3.424-.908v-11.32c0-1.362.978-2.41 2.34-2.41 1.293 0 2.34 1.048 2.34 2.41v13.066c0 .734-.279 1.292-.838 1.642-1.851 1.327-4.332 1.991-7.37 1.991-5.031 0-7.93-2.76-7.93-7.65v-8.978Zm22.722.218V26.91a2.32 2.32 0 0 1-2.34 2.34c-1.258 0-2.34-1.086-2.34-2.34V13.144c0-1.322.978-2.34 2.34-2.34a2.32 2.32 0 0 1 2.34 2.34Zm14.557 11.799h-6.847l8.21-9.327c.873-.978 1.083-1.992.698-3.075-.454-1.152-1.327-1.711-2.62-1.711h-9.501c-1.293 0-2.272.908-2.272 2.166 0 1.292.979 2.13 2.272 2.13h6.462l-8.384 9.538c-.524.593-.769 1.257-.769 1.99 0 1.538 1.188 2.62 2.9 2.62h9.85c1.293 0 2.307-.908 2.307-2.165 0-1.293-1.014-2.166-2.306-2.166Zm8.789-11.8V26.91a2.32 2.32 0 0 1-2.34 2.34c-1.258 0-2.341-1.086-2.341-2.34V13.144c0-1.322.978-2.34 2.34-2.34a2.32 2.32 0 0 1 2.34 2.34Zm14.425 11.8h-6.847l8.21-9.327c.873-.978 1.083-1.992.698-3.075-.454-1.152-1.327-1.711-2.62-1.711h-9.502c-1.292 0-2.27.908-2.27 2.166 0 1.292.978 2.13 2.27 2.13h6.463l-8.384 9.538c-.524.593-.769 1.257-.769 1.99 0 1.538 1.188 2.62 2.9 2.62h9.85c1.293 0 2.307-.908 2.307-2.165 0-1.293-1.014-2.166-2.306-2.166Zm10.01 0h6.846c1.293 0 2.306.873 2.306 2.166 0 1.257-1.013 2.166-2.306 2.166h-9.851c-1.711 0-2.9-1.083-2.9-2.62 0-.734.245-1.398.769-1.991l8.384-9.538h-6.462c-1.293 0-2.271-.838-2.271-2.13 0-1.258.978-2.166 2.271-2.166h9.501c1.293 0 2.167.559 2.621 1.711.384 1.083.174 2.097-.699 3.075l-8.209 9.327Z"
                        clip-rule="evenodd"></path>
                </svg>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
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
import api from "~/server/api/axios";
import API_CONST from "~/utils/apiConst";
import type { ErrorResponse } from "~/constants/type";

export default defineComponent({
    name: 'AdminGameHeader',
    props: {
        code: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const route = useRoute();
        const centerDialogVisible = ref<boolean>(false);
        const outGame = async () => {
            if (route.path.includes(API_CONST.FRONT_END.ADMIN_GAME)) {
                await api.room.adminEndGame(
                    route.params.roomId.toString(),
                    (res: any) => {
                        navigateTo("/admin/dashboard/my-library");
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

        onMounted(() => {});

        return {
            code: props.code,
            centerDialogVisible,
            showModalEndGame,
            outGame,
        };
    },
});
</script>
<style scoped>
nav {
    background-color: #090909cc !important;
    min-height: 80px;
}
</style>
