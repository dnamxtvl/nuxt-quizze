<template>
    <div>
        <div class="w-full d-flex show-question-body flex-column" v-if="showQuestion && currentRoomStatus > 0">
            <div v-if="showQuestion && currentRoomStatus > 0" class="row question-title d-flex flex-wrap justify-content-center align-items-center g-0" style="flex:1">
                <p class="text-white text-center fs-2 lh-base p-3 mt-3">{{ currentQuestionIndex + 1 }}. {{ currentQuestion?.title }}
                </p>
                <!-- <h3 class="text-warning text-center fs-1">{{ timeReply }}</h3> -->
            </div>
            <div v-if="showQuestion && currentRoomStatus > 0" class="row list-answer justify-content-center align-items-center me-0 mt-4" style="flex:1">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer pe-0"
                    v-for="(item, index) in currentQuestion?.answers" :key="index">
                    <div @click="submitAnswer(item.id)"
                        :class="'list-answer-item w-full me-1 d-flex align-items-center justify-content-center position-relative ' + isSelectedAnswer(item.id)">
                        <span class="fs-5 text-white position-absolute right-0 top-0 btn btn-dark mt-2 me-2">{{index +
                            1}}</span>
                        <p class="text-white fs-2 lh-base p-3 mt-4 text-center">{{ item.answer }}</p>
                    </div>
                </div>
            </div>
            <div v-if="showQuestion && currentRoomStatus > 0" class="control-center mt-auto">
                <div class="control-center-container user-game-footer" translate="no" style="opacity: 1;">
                    <div class="ring d-flex">
                        <div class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show">
                        </div>
                        <span class="fs-4 text-white text-center user-name-text me-3 text-primary">
                            {{ gamerInfo?.name }}
                            <div class="fs-4 text-white user-name-text pt-1 rounded-1 border-2">{{ roomCode }}</div>
                        </span>
                        <div class="divider hidden sm:block"></div>
                        <div>
                            <button class="btn btn-light fs-5 fw-bold font-600 text-dark ms-3 button-num-answer">{{
                                currentQuestionIndex + 1 }}/{{ listQuestion.length }}</button>
                        </div>
                    </div>
                    <div class="control-center-actions"></div>
                </div>
            </div>
        </div>
        <div class="table-preview-result" v-if="showResult">
            <div class="row d-flex justify-content-center ms-0 me-0">
                <div class="col-md-10 ms-0 me-0">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane label="Tổng Quan" name="first">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-white">#</th>
                                        <th scope="col" class="fs-6 text-white">Tên</th>
                                        <th scope="col" class="fs-6 text-white">Điểm</th>
                                        <th scope="col" class="fs-6 text-white mw-20">Câu đúng</th>
                                        <th scope="col" class="fs-6 text-white text-center mw-140">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="text-white">1</th>
                                        <td class="text-white">{{ gamerResult?.name }}</td>
                                        <td class="text-white">{{ gamerResult?.gamer_answers_sum_score ?? 0 }}</td>
                                        <td class="text-white">{{ countQuestionTrue(gamerResult) }}</td>
                                        <td class="text-white detail-score text-center">
                                            <div :class="'badge question-result-review rounded-pill ms-1 ' + getResultQuestionColor(gamerResult?.gamer_answers, question.id).class"
                                                v-for="(question, key) in listQuestion" :key="key">
                                                <p>{{ 'Q' + (key + 1) }}</p>
                                                <p>{{ getResultQuestionColor(gamerResult?.gamer_answers,
                                                    question.id).score }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="Câu hỏi" name="second">
                            <div class="row pt-4 rounded rounded-5 body-answer-review ms-0 me-0">
                                <div class="col-lg-12 px-4 mb-2">
                                    <div v-for="(item, index) in listQuestion"
                                        class="question-preview-content border border-primary rounded rounded-3 pl-2 mb-3">
                                        <p class="text-black fw-normal fs-5 pt-2 px-4 text-start text-white font-bold">
                                            {{ (index + 1) + ". " + item.title }}
                                        </p>
                                        <hr>
                                        </hr>
                                        <div class="question-answer-review px-4 pt-2 mb-2">
                                            <div class="form-check" v-for="(answer, index) in item.answers">
                                                <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
                                                <label :class="['form-check-label text-white ms-2', yourAnswerCorrect(gamerResult, answer.id)]" for="flexCheckDefault">
                                                    {{ answer.answer }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <el-dialog v-model="centerDialogVisible" close-icon="false" :close-on-click-modal="false" title="Warning" width="500" align-center>
            <span class="text-center align-center">Admin đã kết thúc màn chơi này!</span>
            <template #footer>
                <div class="dialog-footer">
                    <nuxt-link to="/user/join" class="btn btn-primary">
                        Thoát
                    </nuxt-link>
                </div>
            </template>
        </el-dialog>
        <!-- <div class="show-meme d-flex justify-content-center align-items-center">
        <img src="../../../../public/meme/sad/Screenshot from 2024-07-24 19-03-02.png" alt="meme" with="400" height="400" />
        </div> -->
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, watch } from "vue";
import { ElLoading } from "element-plus";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import type { Answer, ErrorResponse, GamerResult, ItemQuestion } from "~/constants/type";
import { HttpStatusCode } from "axios";
import { RoomSetting, RoomStatus, RoomType } from "~/constants/room";
import type { TabsPaneContext } from 'element-plus';
import { RiUser2Fill, RiCheckFill } from "@remixicon/vue";
import type { GamerAnswer } from "~/constants/type";
import helperApp from "~/utils/helper";
import { CODE } from "~/constants/application";

definePageMeta({
  layout: 'user-game'
})

interface GamerInfo {
    id: string;
    name: string;
    created_at: string
}

export default defineComponent({
    components: {
        RiUser2Fill,
        RiCheckFill
    },
    setup() {
        const route = useRoute();
        const timeReply = ref<number>(0);
        const listQuestion = ref<Array<ItemQuestion>>([]);
        const showQuestion = ref<boolean>(true);
        const showPreviewEnding = ref<boolean>(false);
        const activeName = ref<string>('first')
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
            time_limit: 0,
            answers: [],
            created_at: ''
        });
        const showResult = ref<boolean>(false);
        const roomId = ref<string>('');
        const roomCode = ref<string>('');
        const currentRoomStatus = ref<number>(0);
        const currentScore = ref<number>(0);
        const currentQuestionIndex = ref<number>(0);
        const centerDialogVisible = ref<boolean>(false); 
        const isRoomRunning = ref<boolean>(true);
        const isSubmited = ref<boolean>(false);
        const selectedAnswerId = ref<number>(0);
        const currentScoreAnswer = ref<number|null>(null);

        const yourAnswerCorrect = (gamerResult: GamerResult, answerId: number) => {
            if (gamerResult?.gamer_answers.length > 0) {
                let answer =  gamerResult.gamer_answers.find((item: GamerAnswer) => item.answer_id == answerId);
                if (answer) {
                    return 'text-primary';
                }
            }

            return '';
        }

        const getListQuestion = async () => {
            await api.room.listQuestionOfRoom(
                route.params.tokenId.toString(),
                (res: any) => {
                    if (res.room.type != RoomType.KAHOOT) {
                        ElNotification({title: "Error", message: 'Room không hợp lệ!', type: "error"});
                        return navigateTo("/not-found");
                    }
                    listQuestion.value = res.questions;
                    currentQuestionIndex.value = res.room.status != RoomStatus.PREPARE ?
                        listQuestion.value.findIndex((item: ItemQuestion) => item.id == res.room.current_question_id) : 0;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    gamerInfo.value = res.gamer;
                    gamerResult.value = res.gamer;
                    roomId.value = res.room.id;
                    roomCode.value = res.room.code;
                    currentRoomStatus.value = res.room.status;
                    if (res.room.status == RoomStatus.HAPPING) {
                        timeReply.value = res.time_remaining;
                        calculateTimeReply();
                    }
                    if (res.room.status == RoomStatus.PREPARE_FINISH) {
                        showQuestion.value = false;
                        showResult.value = true;
                    }
                    if (res.gamer?.gamer_answers.length > 0) {
                        let currentQuestionSubmited = res.gamer?.gamer_answers.find((item: GamerAnswer) => item.question_id == currentQuestion.value.id);
                        if (currentQuestionSubmited) {
                            selectedAnswerId.value = currentQuestionSubmited.answer_id;
                            currentScoreAnswer.value = currentQuestionSubmited.score;
                        }
                    }
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    if (err.code === HttpStatusCode.NotFound) {
                        currentRoomStatus.value = -1;
                        return navigateTo("/not-found");
                    }
                    if (err.responseCode == CODE.ERROR_ROOM_FINISHED) {
                        return navigateTo("/user/join");
                    }
                }
            )
        }

        const submitAnswer = async (id: number) => {
            if (timeReply.value == 0) {
                ElNotification({title: "Warning", message: "Chưa đến thời gian submit câu hỏi!", type: "warning", duration: RoomSetting.TIME_DISPLAY_TOAST});
                return ;
            }

            if (isSubmited.value) {
                ElNotification({title: "Oh no!", message: 'Bạn đã trả lời câu hỏi này rồi!', type: "error"});
                return ;
            }

            await api.gamer.submitAnswer(
                {
                    answer_id: id,
                    token: route.params.tokenId.toString()
                },
                (res: any) => {
                    currentScore.value = res.score;
                    selectedAnswerId.value = id;
                    currentScoreAnswer.value = res.score;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Oh no!", message: err.error.shift(), type: "warning", duration: RoomSetting.TIME_DISPLAY_TOAST});
                }
            )
            isSubmited.value = true;
        }

        let intervalId: any;

        const calculateTimeReply = () => {
            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = setInterval(() => {
                if (timeReply.value > 0) {
                    timeReply.value = timeReply.value - 1;
                } else {
                    clearInterval(intervalId);
                }
            }, 1000);
        }

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const countQuestionTrue = (item: GamerResult) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const getResultQuestionColor = (gamerAnswers: Array<GamerAnswer> | [], questionId: string) => {
            return helperApp.getColorOfQuestion(gamerAnswers, questionId);
        }

        const isSelectedAnswer = (answerId: number) => {
            if (answerId == selectedAnswerId.value) {
                return 'selected-answer'
            }
        }
        
        watch(timeReply, async (newValue, oldValue) => {
            if (oldValue == newValue + 1 && newValue == 0 &&
                (currentRoomStatus.value == RoomStatus.HAPPING || currentRoomStatus.value == RoomStatus.PENDING)) {
                    console.log('currentQuestionIndex' + currentQuestionIndex.value);
                if (currentQuestionIndex.value == listQuestion.value.length - 1) {
                    await getListQuestion();
                    showQuestion.value = false;
                    showResult.value = true;
                }

                if (currentScoreAnswer.value != null) {
                    if (currentScoreAnswer.value > 0) {
                        ElNotification({title: "Chúc mừng!", message: "+" + currentScoreAnswer.value, type: "success"});
                        return;
                    }

                    ElNotification({title: "Bạn đã trả lời sai!", message: "Chúc bạn may mắn lần sau!", type: "error"});
                    return;
                }

                ElNotification({title: "Oh no!", message: "Đã hết thời gian trả lời!", type: "warning"});
            }
        });

        onMounted(async () => {
            clearInterval(intervalId);
            const { $echo }: any = useNuxtApp();
            await getListQuestion();
            if (currentRoomStatus.value == 0) {
                ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' });
            }
            $echo.channel('admin.start-game.' + roomId.value)
                .listen('StartGameEvent', (e: any) => {
                    currentRoomStatus.value = RoomStatus.HAPPING;
                    timeReply.value = currentQuestion.value.time_limit;
                    isSubmited.value = false;
                    currentScoreAnswer.value = null;
                    calculateTimeReply();
                    ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' }).close();
                })
                .listen('NextQuestionEvent', (e: any) => {
                    currentQuestionIndex.value = currentQuestionIndex.value + 1;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    timeReply.value = currentQuestion.value.time_limit;
                    isSubmited.value = false;
                    currentScoreAnswer.value = null;
                    calculateTimeReply();
                }).listen('AdminEndgameEvent', (e: any) => {
                    if (currentRoomStatus.value == RoomStatus.PREPARE) {
                        ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' }).close();
                    }
                    isRoomRunning.value = false;
                    centerDialogVisible.value = true;
                });
        });

        onBeforeUnmount(() => {
            clearInterval(intervalId);
            ElLoading.service({ fullscreen: true }).close();
        });

        return {
            showQuestion,
            showPreviewEnding,
            currentQuestion,
            currentQuestionIndex,
            listQuestion,
            gamerInfo,
            submitAnswer,
            currentScore,
            timeReply,
            roomCode,
            showResult,
            activeName,
            handleClick,
            gamerResult,
            countQuestionTrue,
            getResultQuestionColor,
            yourAnswerCorrect,
            centerDialogVisible,
            currentRoomStatus,
            isSelectedAnswer,
            selectedAnswerId,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/user/user-game.scss';
</style>