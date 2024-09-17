<template>
    <div class="container">
        <el-dialog v-model="showModelStartGame" close-icon="false" :close-on-click-modal="false" title="Warning" width="500" align-center>
            <span class="text-center align-center">Bắt đầu bài kiểm tra ngay lập tức?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModelStartGame = false">Hủy</el-button>
                    <el-button type="primary" @click="startGame">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="showModelEndGame" close-icon="false" :close-on-click-modal="false" title="Warning" width="500" align-center>
            <span class="text-center align-center">Bạn có muốn kết thúc bài kiểm tra ngay lập tức?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModelEndGame = false">Hủy</el-button>
                    <el-button type="primary" @click="endGame">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- Header Section -->
        <div class="header">
            <h4 class="text-dark">Wc gần nhất diễn ra vào năm nào?</h4>
            <div class="mb-auto">
                <button class="btn btn-outline-secondary text-dark">Chỉnh sửa câu hỏi</button>
                <button class="btn btn-outline-secondary text-dark">Chỉnh sửa cài đặt</button>
                <button class="btn btn-danger" @click="showModelEndGame = true">Kết thúc</button>
            </div>
        </div>

        <!-- Game Info -->
        <div class="main-card">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <span>Bắt đầu vào: <strong>{{ roomStartAt }}</strong></span>
                    <span class="badge bg-warning ms-1">Chưa Chạy</span>
                </div>
                <button class="btn btn-primary" @click="handleStartGame">Bắt đầu ngay</button>
            </div>
        </div>

        <!-- Invite Section -->
        <div class="purple-card bg-primary mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex justify-content-start">
                        <h5 class="text-white">Mời người tham gia</h5>
                        <span class="fw-bold fs-4 ms-3 text-success">{{ roomCode }}</span>
                        <RiFileCopyLine class="ms-3 cursor-pointer" />
                    </div>
                    <span class="fs-6"><RiTimeLine size="15" /> Hạn chót: <span class="text-success fw-bold">{{ roomEndAt }}</span></span>
                </div>
                <div class="d-flex flex-column text-end">
                    <button class="btn btn-outline-light">Chỉnh sửa</button>
                </div>
            </div>
        </div>

        <!-- Progress Section -->
        <div class="main-card">
            <div class="d-flex justify-content-between align-items-center">
                <span><span class="badge bg-success">Được giao quiz</span> <RiRefreshLine size="15" class="text-primary cursor-pointer" /></span>
                <span class="m-0 text-muted"><RiTimeLine size="15" /> Cập nhật mới nhất: Chưa đầy một phút trước</span>
            </div>
            <div class="row mt-3">
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-answer-correct">
                                    <RiRegisteredLine />
                                </span>
                                </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> 36.9% </h2><span>Câu đúng</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-num-submit">
                                    <RiCheckboxCircleLine />
                                </span>
                                </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> 36.9% </h2><span>Tỷ lệ hoàn thành</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-num-user">
                                    <RiUser2Line />
                                </span>
                                </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> 36.9% </h2><span>Số người chơi</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-question">
                                    <RiQuestionLine />
                                </span>
                                </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> 36.9% </h2><span>Số câu hỏi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 d-flex">
                <button class="btn btn-outline-secondary me-2 text-dark">Xem quiz</button>
            </div>
        </div>

        <!-- Players Section -->
        <div class="players-card main-card">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Người chơi</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#">Câu hỏi</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#">Tổng quan</a>
                </li>
            </ul>

            <div class="empty-section">
                <p>Chưa có người tham gia nào tham gia.</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse, ItemQuizze } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import helperApp from "~/utils/helper";
import { RiMore2Fill, RiDeleteBin7Fill, RiRegisteredLine, RiCheckboxCircleLine, RiUser2Line, RiQuestionLine, RiTimeLine, RiRefreshLine, RiFileCopyLine } from "@remixicon/vue";
import { RoomType } from "~/constants/room";
import moment from "moment";
import { RULES_VALIDATION } from "~/constants/application";
import { useRoute } from "vue-router";

definePageMeta({
    layout: "admin-dashboard",
})

interface Answer {
    id: number;
    answer: string;
    is_correct: boolean;
    created_at: string;
}

interface GamerInfo {
    id: string;
    name: string;
    created_at: string
}

interface ItemQuestion {
    id: string;
    title: string;
    quizze_id: string;
    answers: Array<Answer>;
    created_at: string;
}

interface GamerResult {
    id: string;
    name: string;
    gamer_answers: Array<GamerAnswer> | [];
    gamer_answers_sum_score: number;
    display_meme: boolean;
    ip_address: string;  
    created_at: string;
    updated_at: string;
}

interface GamerAnswer {
    id: number;
    answer_id: number;
    answer_in_time: number;
    gamer_id: string;
    question_id: string;
    room_id: string;
    score: number;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    components: {
        RiMore2Fill,
        RiDeleteBin7Fill,
        RiRegisteredLine,
        RiCheckboxCircleLine,
        RiUser2Line,
        RiQuestionLine,
        RiTimeLine,
        RiRefreshLine,
        RiFileCopyLine,
    },
    setup() {
        const route = useRoute();
        const roomCode = ref<string>("");
        const roomStartAt = ref<string>("");
        const roomEndAt = ref<string>("");
        const showModelStartGame = ref<boolean>(false);
        const showModelEndGame = ref<boolean>(false);

        const getRoomDetail = async () => {
            await api.room.getDetailRoom(
                route.params.roomId as string,
                (res: any) => {
                    roomCode.value = res.room.code;
                    roomStartAt.value = moment(res.room.started_at).format("DD/MM/YYYY HH:mm:ss");
                    roomEndAt.value = moment(res.room.ended_at).format("DD/MM/YYYY HH:mm:ss");
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )

            ElLoading.service({ fullscreen: true }).close();
        }

        const handleStartGame = () => {
            showModelStartGame.value = true;
        }

        const startGame = async () => {
            ElLoading.service({ fullscreen: true });
            await api.room.startGame(
                route.params.roomId.toString(),
                (res: any) => {
                    ElNotification({title: "Success", message: "Bài kiểm tra đang diễn ra!", type: "success"});
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Warning", message: err.error.shift(), type: "warning"});
                }
            )
            showModelStartGame.value = false;
            ElLoading.service({ fullscreen: true }).close();
        }

        const endGame = async () => {
            await api.room.adminEndGame(
                route.params.roomId.toString(),
                (res: any) => {
                    ElNotification({title: "Success", message: "Bài kiểm tra đã kết thúc!", type: "success"});
                    getRoomDetail();
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            );
            showModelEndGame.value = false;
        }
        
        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getRoomDetail();
        });

        return {
            roomCode,
            roomStartAt,
            roomEndAt,
            showModelStartGame,
            startGame,
            handleStartGame,
            endGame,
            showModelEndGame,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>