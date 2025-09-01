<template>
    <div>
        <el-dialog v-model="resultCurrentModel" fullscreen width="500"
            class="align-center d-flex justify-content-center align-items-center result-current-model">
            <p class="text-white fs-1 fw-bold text-center">{{ currentResult.title }}</p>
            <div class="w-full d-flex justify-content-center mb-4 mt-3">
                <div class="text-center justify-content-center text-white fw-bold  icon-result"
                    :class="currentResult.bg_color">
                    <RiCheckFill size="60" v-if="currentResult.type" />
                    <RiCloseFill size="60" v-if="!currentResult.type" />
                </div>
            </div>
            <div class="d-flex justify-content-center align-items-center mb-2">
                <p class="text-white fs-5 fw-bold text-center mb-0">Bạn đang ở vị trí thứ
                </p>
                <div class="order_number ms-2 d-flex justify-content-center align-items-center text-white fw-bold">
                    <span>{{ currentResult.order_number }}</span>
                </div>
            </div>

            <div class="score py-1">
                <p class="mb-0">+ {{ currentResult.score }}</p>
            </div>
        </el-dialog>
        <div class="w-full d-flex show-question-body flex-column" v-if="showQuestion && currentRoomStatus > 0">
            <div v-if="showQuestion && currentRoomStatus > 0"
                class="row list-answer  align-items-center me-0 mt-4 px-3">
                <div class="col-12 col-sm-6 col-md-6 col-lg-6 cursor-pointer pe-0 mb-2 "
                    v-for="(item, index) in currentQuestion?.answers" :key="index">
                    <div @click="submitAnswer(item.id)"
                        :class="'list-answer-item w-full me-1 d-flex align-items-center justify-content-center position-relative ' + isSelectedAnswer(item.id)"
                        :style="{ background: backgroundColorAnswers[index] }">
                        <!-- <span class="fs-3 text-white position-absolute right-0 top-0 btn btn-dark mt-2 me-2 border-0"
                            :style="{ background: backgroundColorAnswers[index] }">
                            {{index + 1}}
                        </span> -->
                        <p class="text-white fs-2 lh-base p-3 mt-4 text-center">{{ item.answer }}</p>
                    </div>
                </div>
            </div>
            <div v-if="currentRoomStatus > 0" class="control-center mt-auto">
                <div class="control-center-container user-game-footer ps-5" translate="no" style="opacity: 1;">
                    <div class="ring d-flex align-items-center">
                        <span class="fs-4 text-white text-center me-3 text-primary">
                            {{ gamerInfo?.name }}
                        </span>
                        <div class="divider hidden sm:block"></div>
                        <div>
                            <button class="btn btn-light fs-5 fw-bold font-600 text-dark ms-3">{{
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
                    <el-tabs v-model="activeName" class="demo-tabs  mt-5" @tab-click="handleClick">
                        <el-tab-pane label="Tổng Quan" name="first">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-white text-center">Xếp hạng</th>
                                        <th scope="col" class="fs-6 text-white text-center">Tên</th>
                                        <th scope="col" class="fs-6 text-white text-center">Tổng Điểm</th>
                                        <th scope="col" class="fs-6 text-white mw-20">Câu đúng</th>
                                        <th scope="col" class="fs-6 text-white text-center mw-140">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="text-white text-center">{{ currentResult.order_number }}
                                        </th>
                                        <td class="text-white text-center">{{ gamerResult?.name }}</td>
                                        <td class="text-white text-center">{{ gamerResult?.gamer_answers_sum_score ?? 0
                                            }}</td>
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
                                        <div class="d-flex justify-content-start">
                                            <span class="fw-normal fs-5 pt-2 ps-3 pe-2 text-start text-white font-bold">
                                                {{ (index + 1) + ". " }}
                                            </span>
                                            <div class="text-white fs-5 pt-2 text-start font-bold" v-html="item.title"></div>
                                        </div>
                                        <hr></hr>
                                        <div class="question-answer-review px-4 pt-2 mb-2">
                                            <div class="form-check" v-for="(answer, index) in item.answers">
                                                <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
                                                <label
                                                    :class="['form-check-label text-white ms-2', yourAnswerCorrect(gamerResult, answer.id)]"
                                                    for="flexCheckDefault">
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
        <el-dialog v-model="centerDialogVisible" close-icon="false" :close-on-click-modal="false" title="Warning"
            width="500" align-center>
            <span class="text-center align-center">Admin đã kết thúc màn chơi này!</span>
            <template #footer>
                <div class="dialog-footer">
                    <nuxt-link to="/user/join" class="btn btn-primary">
                        Thoát
                    </nuxt-link>
                </div>
            </template>
        </el-dialog>
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
import { RiUser2Fill, RiCheckFill, RiCloseFill } from "@remixicon/vue";
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

interface CurrentResult {
    score: number,
    order_number: number,
    title: string,
    bg_color: string,
    type: boolean
}

export default defineComponent({
    components: {
        RiUser2Fill,
        RiCheckFill,
        RiCloseFill
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
        const selectedAnswerId = ref<number | null>(0);
        const currentScoreAnswer = ref<number | null>(null);
        const backgroundColorAnswers = ref<string[]>([
            '#E21B3C',
            '#D89E00',
            '#1368CE',
            '#26890C'
        ]);
        const resultCurrentModel = ref<boolean>(false);
        const currentResult = ref<CurrentResult>(
            {
                score: 0,
                order_number: 0,
                title: 'warning',
                bg_color: 'red',
                type: false
            }
        );
        const loadingInstance: Ref<ReturnType<typeof ElLoading.service> | null> = ref(null);
        const countReconnected = ref<number>(0);

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
                    currentResult.value.order_number = res.order_result_gamers.find((item: any) => item.gamer_id == gamerInfo.value?.id)?.index;

                    if (res.room.status == RoomStatus.HAPPING) {
                        timeReply.value = res.time_remaining;
                        calculateTimeReply();
                    }
                    if (res.room.status == RoomStatus.PREPARE_FINISH) {
                        showQuestion.value = false;
                        showResult.value = true;
                        loadingInstance.value = null;
                    }
                    if (res.gamer?.gamer_answers.length > 0) {
                        let currentQuestionSubmited = res.gamer?.gamer_answers.find((item: GamerAnswer) => item.question_id == currentQuestion.value.id);
                        if (currentQuestionSubmited) {
                            selectedAnswerId.value = currentQuestionSubmited.answer_id;
                            currentScoreAnswer.value = currentQuestionSubmited.score;
                        }
                    }
                    if (res.room.status == RoomStatus.PENDING) {
                        showQuestion.value = false;
                        resultCurrentModel.value = true;
                        currentResult.value.bg_color = currentScore.value > 0 ? 'bg-correct' : 'bg-incorrect';
                        getCurrentResultOrder();
                    }
                    if (selectedAnswerId.value && res.room.status != RoomStatus.PENDING && res.room.status != RoomStatus.PREPARE_FINISH) {
                        if (!loadingInstance.value) { 
                            loadingInstance.value = ElLoading.service({ fullscreen: true, text: 'BẠN ĐÃ CHỌN ĐÁP ÁN' });
                            showResult.value = false;
                        }
                        showQuestion.value = false;
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
            if (!loadingInstance.value) {
                loadingInstance.value = ElLoading.service({ fullscreen: true, text: 'BẠN ĐÃ CHỌN ĐÁP ÁN' });
                showResult.value = false;
            }
            showQuestion.value = false;
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
                    getCurrentResultOrder();
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
                    ElLoading.service({ fullscreen: true }).close();
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
                showQuestion.value = false;
                if (loadingInstance.value) {
                    loadingInstance.value.close();
                    loadingInstance.value = null;
                }
                if (currentQuestionIndex.value == listQuestion.value.length - 1) {
                    await getListQuestion();
                }

            }
        });

        const getCurrentResultOrder = () => {
            if (currentScoreAnswer.value != null) {
                if (currentScoreAnswer.value > 0) {
                    currentResult.value.score = currentScoreAnswer.value;
                    currentResult.value.title = 'ĐÚNG';
                    currentResult.value.bg_color = 'bg-correct';
                    currentResult.value.type = true;
                } else {
                    currentResult.value.score = 0;
                    currentResult.value.title = 'SAI';
                    currentResult.value.bg_color = 'bg-incorrect';
                    currentResult.value.type = false;
                }   
            } else {
                currentResult.value.score = 0;
                currentResult.value.title = 'HẾT THỜI GIAN';
                currentResult.value.bg_color = 'bg-incorrect';
                currentResult.value.type = false;
            }
        }

        const prepareFinish = () => {
            showQuestion.value = false;
            showResult.value = true;
            resultCurrentModel.value = false;
            loadingInstance.value = null;
            ElLoading.service({ fullscreen: true }).close();
        }

        onMounted(async () => {
            countReconnected.value = 0;
            clearInterval(intervalId);
            const { $echo }: any = useNuxtApp();
            await getListQuestion();
            if (currentRoomStatus.value == 0) {
                ElLoading.service({ fullscreen: true, text: 'CHỜ MÀN CHƠI BẮT ĐẦU!' });

            }
            $echo.channel('admin.start-game.' + roomId.value)
                .listen('StartGameEvent', (e: any) => {
                    currentRoomStatus.value = RoomStatus.HAPPING;
                    timeReply.value = currentQuestion.value.time_reply as number;
                    isSubmited.value = false;
                    currentScoreAnswer.value = null;
                    calculateTimeReply();
                    ElLoading.service({ fullscreen: true, text: 'CHỜ MÀN CHƠI BẮT ĐẦU!' }).close();
                })
                .listen('NextQuestionEvent', (e: any) => {
                    resultCurrentModel.value = false;
                    showQuestion.value = true;
                    currentQuestionIndex.value = currentQuestionIndex.value + 1;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    timeReply.value = currentQuestion.value.time_reply as number;
                    isSubmited.value = false;
                    currentScoreAnswer.value = null;
                    selectedAnswerId.value = null;
                    calculateTimeReply();
                }).listen('AdminEndgameEvent', (e: any) => {
                    if (currentRoomStatus.value == RoomStatus.PREPARE) {
                        ElLoading.service({ fullscreen: true, text: 'CHỜ MÀN CHƠI BẮT ĐẦU!' }).close();
                    }
                    isRoomRunning.value = false;
                    centerDialogVisible.value = true;
                });
                
            $echo.channel('user.room.' + roomId.value)
                .listen('GetGamerNumberEvent', (e: any) => {
                    let orderNumberGameArray = e.orderNumberGamers;
                    orderNumberGameArray.forEach( (gamer: any) => {
                        if (gamer.gamer_id === gamerInfo.value?.id) {
                            currentResult.value.order_number = gamer.id;
                            return;
                        }
                    });

                    getCurrentResultOrder();
                    resultCurrentModel.value = true;

                    if (currentQuestionIndex.value == listQuestion.value.length - 1) {
                        setTimeout(() => {
                            prepareFinish();
                        }, 4000)
                    }
                });

            const { $bus }: any = useNuxtApp();
            $bus.$on('lostConnection', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Error", message: countReconnected.value == 0 ? "Bạn đang offline!" : "Reconnect lần " + countReconnected.value + " thất bại!", type: "error", duration: 0 });
                countReconnected.value = countReconnected.value + 1;
            });

            $bus.$on('reconnected', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Reconected", message: "Đã khôi phục kết nối!", type: "success", duration: 3000 });
                getListQuestion();
                countReconnected.value = 0;
            });

            $bus.$on('lostConnectionEver', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Error", message: "Hãy kiểm tra lại kết nối mạng và tải lại trang!", type: "error", duration: 0 });
            })
        });

        onBeforeUnmount(() => {
            clearInterval(intervalId);
            ElLoading.service({ fullscreen: true }).close();
            countReconnected.value = 0;
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
            backgroundColorAnswers,
            resultCurrentModel,
            currentResult,

        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/user/user-game.scss';
</style>