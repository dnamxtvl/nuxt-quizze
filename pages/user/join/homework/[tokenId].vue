<template>
    <div class="container mt-4">
        <el-dialog v-model="centerDialogVisible" close-icon="false" :close-on-click-modal="false" title="Warning" width="500" align-center>
            <span class="text-center align-center">Admin đã kết thúc bài kiểm tra này!</span>
            <template #footer>
                <div class="dialog-footer">
                    <button class="btn btn-primary" @click="getListQuestion">
                        Xem kết quả
                    </button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="showModalSubmitExam" title="Warning" width="400" align-center>
            <span>Bạn có chắc chắn muốn nộp bài?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModalSubmitExam = false">Hủy</el-button>
                    <el-button type="primary" @click="submitExam">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <div class="row">
            <!-- Left Panel: Question List -->
            <div class="col-lg-4 col-md-5 mb-4">
                <div class="quiz-card">
                    <div class="d-flex justify-content-center align-items-center mb-2" v-if="currentRoomStatus != statusPrepare && isRoomRunning">
                        <div class="time-box fs-3 text-center">{{ converSecond(timeReply) }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2" v-if="!isRoomRunning && currentRoomStatus != statusPrepare">
                        <div class="time-box fs-3 text-center">{{ countQuestionTrue(gamerResult) + "/" + listQuestion.length }}</div>
                        <div class="time-box fs-6 text-danger text-center">Đã kết thúc lúc {{ submitedExamAt }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div v-if="!(!isRoomRunning && currentRoomStatus != statusPrepare)">
                            <span class="material-symbols-outlined bg-warning me-1"></span>
                            <label for="markQuestion">Đánh dấu</label>
                        </div>
                        <div v-if="(!isRoomRunning && currentRoomStatus != statusPrepare)">
                            <span class="material-symbols-outlined bg-danger me-1"></span>
                            <label for="markQuestion">Trả lời sai</label>
                        </div>
                        <div v-if="(!isRoomRunning && currentRoomStatus != statusPrepare)">
                            <span class="material-symbols-outlined bg-success me-1"></span>
                            <label for="markQuestion">Trả lời đúng</label>
                        </div>
                        <div>
                            <span class="material-symbols-outlined bg-primary me-1"></span>
                            <label for="markQuestion">Đã trả lời</label>
                        </div>
                        <div>
                            <span
                                class="material-symbols-outlined border border-dark border-black bg-white me-1"></span>
                            <label for="markQuestion">Chưa trả lời</label>
                        </div>
                    </div>
                    <h5>Danh sách câu hỏi</h5>
                    <div class="question-list">
                        <!-- Question List -->
                        <button :class='"btn unanswered border border-secondary " + getStatusQuestion(item.id)' v-for="(item, index) in listQuestion" :key="index" @click="handleSelectQuestion(index)">{{ index + 1 }}</button>
                        <!-- More buttons for each question -->
                    </div>
                    <button v-if="currentRoomStatus != statusPrepare && isRoomRunning" class="btn btn-primary mt-3 w-100" @click="handleModalSubmitExam">Nộp bài</button>
                </div>
            </div>

            <!-- Right Panel: Question Details -->
            <div class="col-lg-8 col-md-7" v-show="currentRoomStatus != statusPrepare">
                <div class="quiz-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>Câu {{ currentQuestionIndex + 1 }}</h5>
                        <div class="mb-auto">
                            <span class="material-symbols-outlined bg-warning cursor-pointer me-1"></span>
                            <label for="markQuestion">Đánh dấu</label>
                        </div>
                    </div>
                    <p class="fs-5">{{ currentQuestion?.title }}</p>
                    <!-- Answer Options -->
                    <form>
                        <div class="form-check" v-for="(item, index) in currentQuestion?.answers" :key="index">
                            <input class="form-check-input" :value="item.id" :disabled="!isRoomRunning"
                            v-model="selectedAnswer[currentQuestion?.id]"  type="radio" :name='"answer_" + currentQuestion?.id' @change="handleSelectAnswer(item?.id)">
                            <label :class='"form-check-label " + checkAnswerCorrect(item?.id)' for="option1">
                                {{ defaultStringSort[index] }}. {{ item.answer }}
                            </label>
                        </div>
                    </form>
                    <!-- Navigation Buttons -->
                    <div class="d-flex justify-content-center mt-4">
                        <button class="btn btn-link btn-nav me-2 text-dark text-center whitespace-nowrap" v-if="currentQuestionIndex != 0">
                            <RiArrowLeftSLine />
                            <span class="mt-1" @click="handlePreviousQuestion">Câu trước</span>
                        </button>
                        <button class="btn btn-primary btn-nav ms-2 whitespace-nowrap text-center" v-if="currentQuestionIndex != listQuestion.length - 1">
                            <span class="ms-2" @click="handleNextQuestion">Câu sau</span>
                            <RiArrowRightSLine size="14"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, watch } from "vue";
import { ElLoading } from "element-plus";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import type { ErrorResponse } from "~/constants/type";
import { HttpStatusCode } from "axios";
import { RoomSetting, RoomStatus } from "~/constants/room";
import { RiUser2Fill, RiCheckFill, RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/vue";
import helperApp from "~/utils/helper";
import moment from "moment";
import { useDebounceFn } from "@vueuse/core";

definePageMeta({
  layout: 'homework'
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
        RiUser2Fill,
        RiCheckFill,
        RiArrowLeftSLine,
        RiArrowRightSLine,
    },
    setup() {
        const route = useRoute();
        const defaultStringSort = ref<string>('ABCDEFGH');
        const timeReply = ref<number>(0);
        const statusPrepare = RoomStatus.PREPARE;
        const listQuestion = ref<Array<ItemQuestion>>([]);
        const showQuestion = ref<boolean>(true);
        const gamerInfo = ref<GamerInfo>();
        const gamerResult = ref<GamerResult>(
            {
                id: '',
                name: '',
                gamer_answers: [],
                gamer_answers_sum_score: 0,
                display_meme: false,
                ip_address: '',
                created_at: '',
                updated_at: ''
            }
        );
        const currentQuestion = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: ''
        });
        const showResult = ref<boolean>(false);
        const roomId = ref<string>('');
        const roomCode = ref<string>('');
        const currentRoomStatus = ref<number>(0);
        const currentQuestionIndex = ref<number>(0);
        const centerDialogVisible = ref<boolean>(false); 
        const isRoomRunning = ref<boolean>(true);
        const isSubmited = ref<boolean>(false);
        const currentRoomEndAt = ref<string>("");
        const currentRoomStartAt = ref<string>("");
        const showModalSubmitExam = ref<boolean>(false);
        const selectedAnswer = ref({});
        const submitedExamAt = ref<string>("");
        const autoSubmit = ref<boolean>(false);

        const checkAnswerCorrect = (answerId: number) => {
            if (isRoomRunning.value) {
                return '';
            }

            if (currentQuestion.value?.answers.length > 0) {
                let answer =  currentQuestion.value?.answers.find((item: Answer) => item.id == answerId);
                if (answer) {
                    return answer.is_correct ? 'text-success' : '';
                }
            }

            return '';
        }

        const getListQuestion = async () => {
            ElLoading.service({ fullscreen: true });
            await api.room.listQuestionOfRoom(
                route.params.tokenId.toString(),
                (res: any) => {
                    listQuestion.value = res.questions;
                    currentQuestionIndex.value = 0;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    gamerInfo.value = res.gamer;
                    gamerResult.value = res.gamer;
                    roomId.value = res.room.id;
                    roomCode.value = res.room.code;
                    currentRoomEndAt.value = res.room.ended_at;
                    currentRoomStartAt.value = res.room.started_at;
                    currentRoomStatus.value = res.room.status;
                    if (currentRoomStartAt.value > currentRoomEndAt.value) {
                        ElNotification({title: "Warning!", message: 'Admin đã kết thúc bài thi trước khi nó bắt đầu!', type: "warning", duration: RoomSetting.TIME_DISPLAY_TOAST});
                        return navigateTo("/user/join");
                    }
                    isRoomRunning.value = !(res.gamer_token.submit_at || res.room.status == RoomStatus.FINISHED);
                    submitedExamAt.value = res.gamer_token.submit_at ?
                        moment(res.gamer_token.submit_at).format("DD/MM/YYYY HH:mm:ss") :
                        (res.room.status == RoomStatus.FINISHED ? moment(res.room.ended_at).format("DD/MM/YYYY HH:mm:ss") : "");
                    if (res.room.status == RoomStatus.HAPPING && !isSubmited.value) {
                        timeReply.value = res.time_remaining;
                        calculateTimeReply();
                    }
                    if (res.room.status == RoomStatus.PREPARE_FINISH) {
                        showQuestion.value = false;
                        showResult.value = true;
                    }
                    if (res.gamer?.gamer_answers.length > 0) {
                        res.gamer?.gamer_answers.forEach((item: GamerAnswer) => {
                            selectedAnswer.value[item.question_id] = item.answer_id;
                        })
                    }
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    if (err.code === HttpStatusCode.NotFound) {
                        currentRoomStatus.value = -1;
                        return navigateTo("/not-found");
                    }
                }
            )

            ElLoading.service({ fullscreen: true }).close();
            centerDialogVisible.value = false;
        }

        const submitAnswer = async (id: number) => {
            await api.gamer.submitAnswer(
                {
                    answer_id: id,
                    token: route.params.tokenId.toString()
                },
                (res: any) => {
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error!", message: err.error.shift(), type: "error", duration: RoomSetting.TIME_DISPLAY_TOAST});
                }
            )
        }

        let intervalId: any;

        const calculateTimeReply = () => {
            intervalId = setInterval(() => {
                if (timeReply.value > 0) {
                    timeReply.value = timeReply.value - 1;
                } else {
                    clearInterval(intervalId);
                }
            }, 1000);
        }

        const countQuestionTrue = (item: GamerResult) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const handleModalSubmitExam = () => {
            showModalSubmitExam.value = true;
        }

        const handleSelectQuestion = (id: number) => {
            currentQuestionIndex.value = id;
            currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
        }

        const handlePreviousQuestion = () => {
            if (currentQuestionIndex.value > 0) {
                currentQuestionIndex.value = currentQuestionIndex.value - 1;
                currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
            }
        }

        const handleNextQuestion = () => {
            if (currentQuestionIndex.value < listQuestion.value.length - 1) {
                currentQuestionIndex.value = currentQuestionIndex.value + 1;
                currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
            }
        }

        const converSecond = (second: number) => {
            return helperApp.convertSecondsToTime(second);
        }

        const handleSelectAnswer = useDebounceFn((answerId: number) => {
            submitAnswer(answerId);
        }, 1000);

        const getStatusQuestion = (questionId: string) => {
            let selectedAnswerIdReview = selectedAnswer.value[questionId];
            if (selectedAnswerIdReview) {
                if (!isRoomRunning.value && currentRoomStatus.value != statusPrepare) {
                    let answersOfQuestion = listQuestion.value.find((item: ItemQuestion) => item.id == questionId)?.answers;
                    if (answersOfQuestion) {
                        return answersOfQuestion.find((item: Answer) => item.id == selectedAnswerIdReview)?.is_correct ? 'bg-success text-white' : 'bg-danger text-white';
                    }
                }

                return 'bg-primary text-white';
            }

            return '';
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        }

        const submitExam = async () => {
            await api.gamer.submitHomework(
                route.params.tokenId.toString(),
                { results: selectedAnswer.value, auto_submit: autoSubmit.value },
                (res: any) => {
                    ElNotification({title: "Success!", message: 'Nộp bài thành công!', type: "success", duration: RoomSetting.TIME_DISPLAY_TOAST});
                    clearInterval(intervalId);
                    getListQuestion();
                    isSubmited.value = true;
                    isRoomRunning.value = false;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error!", message: err.error.shift(), type: "error", duration: RoomSetting.TIME_DISPLAY_TOAST});
                }
            )
            showModalSubmitExam.value = false;
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }

        watch(timeReply, (newValue, oldValue) => {
            if (oldValue == newValue + 1 && newValue == 0 && currentRoomStatus.value == RoomStatus.HAPPING && !isSubmited.value) {
                autoSubmit.value = true;
                submitExam();
            }
        });

        onMounted(async () => {
            clearInterval(intervalId);
            const { $echo }: any = useNuxtApp();
            await getListQuestion();
            window.addEventListener('beforeunload', handleBeforeUnload);
            if (currentRoomStatus.value == 0) {
                ElLoading.service({ fullscreen: true, text: 'Bài thi sẽ diễn ra vào lúc ' + moment(currentRoomStartAt.value).format('HH:mm:ss') });
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
            $echo.channel('admin.start-game.' + roomId.value)
                .listen('StartGameEvent', (e: any) => {
                    currentRoomStatus.value = RoomStatus.HAPPING;
                    isRoomRunning.value = true;
                    timeReply.value = moment(currentRoomEndAt.value).diff(moment(), 'seconds');
                    isSubmited.value = false;
                    calculateTimeReply();
                    ElLoading.service({ fullscreen: true, text: 'Bài thi sẽ diễn ra vào lúc ' + moment(currentRoomStartAt.value).format('HH:mm:ss') }).close();
                    window.addEventListener('beforeunload', handleBeforeUnload);
                })
                .listen('AdminEndgameEvent', (e: any) => {
                    if (currentRoomStatus.value == RoomStatus.PREPARE) {
                        ElLoading.service({ fullscreen: true, text: 'Bài thi sẽ diễn ra vào lúc ' + moment(currentRoomStartAt.value).format('HH:mm:ss') }).close();
                        ElNotification({title: "Warning!", message: 'Admin đã kết thúc bài thi!', type: "warning", duration: RoomSetting.TIME_DISPLAY_TOAST});
                        return navigateTo("/user/join");
                    }
                    if (isRoomRunning.value) {
                        isRoomRunning.value = false;
                        centerDialogVisible.value = true;
                    }
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                });
        });

        onBeforeUnmount(() => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearInterval(intervalId);
            ElLoading.service({ fullscreen: true }).close();
        });

        return {
            showQuestion,
            statusPrepare,
            currentQuestion,
            currentQuestionIndex,
            listQuestion,
            gamerInfo,
            submitAnswer,
            timeReply,
            roomCode,
            showResult,
            gamerResult,
            countQuestionTrue,
            checkAnswerCorrect,
            centerDialogVisible,
            currentRoomStatus,
            handleModalSubmitExam,
            showModalSubmitExam,
            handleSelectQuestion,
            handlePreviousQuestion,
            handleNextQuestion,
            converSecond,
            handleSelectAnswer,
            getStatusQuestion,
            selectedAnswer,
            submitExam,
            isRoomRunning,
            submitedExamAt,
            defaultStringSort,
            getListQuestion,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/user/homework.scss';
</style>