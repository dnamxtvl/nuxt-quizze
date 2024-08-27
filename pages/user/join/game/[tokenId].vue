<template>
    <div>
        <div class="w-full" v-show="showQuestion && currentRoomStatus > 0">
            <div class="row question-title d-flex flex-wrap justify-content-center align-items-center">
                <p class="text-white text-center fs-2 mt-3">{{ currentQuestionIndex + 1 }}. {{ currentQuestion?.title }}
                </p>
                <!-- <h3 class="text-warning text-center fs-1">{{ timeReply }}</h3> -->
            </div>
            <div class="row list-answer justify-content-center align-items-center mt-4">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer"
                    v-for="(item, index) in currentQuestion?.answers" :key="index">
                    <div @click="submitAnswer(item.id)"
                        class="list-answer-item w-full ms-1 me-1 d-flex align-items-center justify-content-center position-relative">
                        <span class="fs-5 text-white position-absolute right-0 top-0 btn btn-dark mt-2 me-2">{{index +
                            1}}</span>
                        <p class="text-white fs-2 text-center">{{ item.answer }}</p>
                    </div>
                </div>
            </div>
            <div class="control-center">
                <div class="control-center-container user-game-footer" translate="no" style="opacity: 1;">
                    <div class="ring d-flex">
                        <div class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show">
                            <div class="coccoc-alo-ph-circle"></div>
                            <div class="coccoc-alo-ph-circle-fill"></div>
                            <div class="coccoc-alo-ph-img-circle"></div>
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
        <div class="w-full d-flex justify-content-center" v-if="showPreviewEnding">
            <div class="col-lg-4 col-md-6 col-12 bg-dark-with-opacity rounded row">
                <div translate="no" class="main-section-title text-center text-white mt-4">
                    <div class="row">
                        <p class="font-medium fs-5 text-base text-ds-light-500">Summary</p>
                        <h4 class="text-white">Remarkable win, keep it up!</h4>
                    </div>
                    <div class="row px-4">
                        <div class="col-lg-4">
                            <div class="bg-dark rounded pl-4">
                                <h5 class="text-center pt-2 ml-2 text-white fw-normal">Score</h5>
                                <h6 class="text-center pt-2 pb-2 text-white fw-normal">1490</h6>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bg-dark ms-1 rounded pl-4">
                                <h5 class="text-center pt-2 ml-2 text-white fw-normal">Total</h5>
                                <h6 class="text-center pt-2 pb-2 ml-2 text-white fw-normal">10</h6>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="bg-dark ms-1 rounded pl-4">
                                <h5 class="text-center pt-2 ml-2 text-white fw-normal">Correct</h5>
                                <h6 class="text-center pt-2 pb-2 text-white fw-normal">5</h6>
                            </div>
                        </div>
                    </div>
                    <div class="row pt-4 bg-dark rounded">
                        <h6 class="text-start text-white mt-2 mx-2 fw-normal">Xem lại Câu hỏi</h6>
                        <div class="col-lg-12 px-4 mb-2">
                            <div
                                class="question-preview-content bg-white border border-danger rounded rounded-3 pl-2 mb-3">
                                <p class="text-black fw-normal fs-5 pt-2 px-4 text-start">1. Wc gần nhất diễn ra vào năm
                                    nào?</p>
                                <hr>
                                </hr>
                                <div class="question-answer-review px-4 pt-2 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                        <label class="form-check-label text-black ms-2" for="flexCheckDefault">
                                            2021
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2022
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2019
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2012
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="question-preview-content bg-white border border-danger rounded pl-2 mb-3 rounded rounded-3">
                                <p class="text-black fw-normal fs-5 pt-2 px-4 text-start">1. Wc gần nhất diễn ra vào năm
                                    nào?</p>
                                <hr>
                                </hr>
                                <div class="question-answer-review px-4 pt-2 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                        <label class="form-check-label text-black ms-2" for="flexCheckDefault">
                                            2021
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2022
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2019
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2012
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="question-preview-content bg-white border border-danger rounded pl-2 mb-3 rounded rounded-3">
                                <p class="text-black fw-normal fs-5 pt-2 px-4 text-start">1. Wc gần nhất diễn ra vào năm
                                    nào?</p>
                                <hr>
                                </hr>
                                <div class="question-answer-review px-4 pt-2 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                        <label class="form-check-label text-black ms-2" for="flexCheckDefault">
                                            2021
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2022
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2019
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2012
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="question-preview-content bg-white border border-danger rounded pl-2 mb-3 rounded rounded-3">
                                <p class="text-black fw-normal fs-5 pt-2 px-4 text-start">1. Wc gần nhất diễn ra vào năm
                                    nào?</p>
                                <hr>
                                </hr>
                                <div class="question-answer-review px-4 pt-2 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                        <label class="form-check-label text-black ms-2" for="flexCheckDefault">
                                            2021
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2022
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2019
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                                            checked>
                                        <label class="form-check-label text-black ms-2" for="flexCheckChecked">
                                            2012
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-preview-result" v-if="showResult">
            <div class="row d-flex justify-content-center">
                <div class="col-md-5">
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
                                        <td class="text-white">{{ gamerResult?.gamer_answers_sum_score }}</td>
                                        <td class="text-white">{{ countQuestionTrue(gamerResult) }}</td>
                                        <td class="text-white detail-score">
                                            <div :class="'badge question-result-review rounded-pill ms-1 ' + getResultQustionColor(gamerResult?.gamer_answers, question.id).class"
                                                v-for="(question, key) in listQuestion" :key="key">
                                                <p>{{ 'Q' + (key + 1) }}</p>
                                                <p>{{ getResultQustionColor(gamerResult?.gamer_answers,
                                                    question.id).score }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="Câu hỏi" name="second">
                            <div class="row pt-4 rounded rounded-5 body-answer-review">
                                <div class="col-lg-12 px-4 mb-2">
                                    <div v-for="(item, index) in listQuestion"
                                        class="question-preview-content border border-primary rounded rounded-3 pl-2 mb-3">
                                        <p class="text-black fw-normal fs-5 pt-2 px-4 text-start text-white font-bold">
                                            {{ (index + 1) + "." + item.title }}
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
import { defineComponent, ref, onBeforeUnmount } from "vue";
import { ElLoading } from "element-plus";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import type { ErrorResponse } from "~/constants/type";
import { HttpStatusCode } from "axios";
import { RoomStatus } from "~/constants/room";
import type { TabsPaneContext } from 'element-plus';
import { RiUser2Fill, RiCheckFill } from "@remixicon/vue";

definePageMeta({
  layout: 'user-game'
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
        const gamerResult = ref<any>([]);
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

        const yourAnswerCorrect = (gamerResult: any, answerId: number) => {
            if (gamerResult?.gamer_answers.length > 0) {
                let answer =  gamerResult.gamer_answers.find((item: any) => item.answer_id == answerId);
                if (answer) {
                    return 'text-primary';
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
                    currentQuestionIndex.value = res.room.status != RoomStatus.PREPARE ?
                        listQuestion.value.findIndex((item: ItemQuestion) => item.id == res.room.current_question_id) : 0;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    gamerInfo.value = res.gamer;
                    gamerResult.value = res.gamer;
                    roomId.value = res.room.id;
                    roomCode.value = res.room.code;
                    console.log(res);
                    currentRoomStatus.value = res.room.status;
                    if (res.room.status == RoomStatus.HAPPING) {
                        timeReply.value = res.time_remaining;
                        calculateTimeReply();
                        if (currentQuestionIndex.value == listQuestion.value.length - 1) {
                            setTimeout(async () => {
                                await getListQuestion();
                            }, res.time_remaining * 1000);
                        }
                    }
                    if (res.room.status == RoomStatus.PREPARE_FINISH) {
                        showQuestion.value = false;
                        showResult.value = true;
                    }
                    ElLoading.service({ fullscreen: true }).close();
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    ElLoading.service({ fullscreen: true }).close();
                    if (err.code === HttpStatusCode.NotFound) {
                        currentRoomStatus.value = -1;
                        return navigateTo("/not-found");
                    }
                }
            )
        }

        const submitAnswer = async (id: number) => {
            if (timeReply.value == 0) {
                return ElNotification({title: "Warning", message: "Chưa đến thời gian submit câu hỏi!", type: "warning", duration: 5000});
            }
            await api.gamer.submitAnswer(
                {
                    answer_id: id,
                    token: route.params.tokenId.toString()
                },
                (res: any) => {
                    currentScore.value = res.score;
                    if (res.score > 0) {
                        ElNotification({title: "Chúc mừng!", message: "+" + res.score, type: "success"});
                    } else {
                        ElNotification({title: "Bạn đã trả lời sai!", message: "Chúc bạn may mắn lần sau!", type: "error"});
                    }
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Oh no!", message: err.error.shift(), type: "error", duration: 5000});
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

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const countQuestionTrue = (item: any) => {
            return item.gamer_answers.filter((answer: any) => answer.score > 0).length;
        }

        const getResultQustionColor = (gamerAnswers: any, questionId: string) => {
            if (gamerAnswers.length == 0) {
                return {
                    score: 0,
                    class: "bg-warning"
                };
            }

            let answer = gamerAnswers.filter((answer: any) => answer.question_id == questionId);

            if (answer.length > 0) {
                if (answer[0].score > 0) {
                    return {
                        score: answer[0].score,
                        class: "bg-success"
                    };
                }

                return {
                    score: 0,
                    class: "bg-danger"
                }
            }
            
            return {
                score: 0,
                class: "bg-warning"
            };
        }

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
                    timeReply.value = 30;
                    calculateTimeReply();
                    ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' }).close();
                })
                .listen('NextQuestionEvent', (e: any) => {
                    currentQuestionIndex.value = currentQuestionIndex.value + 1;
                    currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                    timeReply.value = 30;
                    calculateTimeReply();
                    if (currentQuestionIndex.value == listQuestion.value.length - 1) {
                        setTimeout(async () => {
                            if (isRoomRunning.value) {
                                await getListQuestion();
                            }
                        }, 30000);
                    }
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
            getResultQustionColor,
            yourAnswerCorrect,
            centerDialogVisible,
            currentRoomStatus,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/user/user-game.scss';
</style>