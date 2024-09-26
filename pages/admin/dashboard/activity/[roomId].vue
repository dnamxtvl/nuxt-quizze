<template>
    <div class="row position-relative body-admin-game w-full g-0">
        <div class="row panel-wrapper d-flex rounded-4 justify-content-center prepare-join d-flex flex-col items-center"
            v-if="showPrepare">
            <div
                class="col-md-4 join-code header row d-flex justify-content-center p-4 gap-4 bg-ds-dark-500-900 rounded">
                <div class="row join-code-body rounded">
                    <div class="col-xl-2 col-lg-3 col-md-4 text-white text-center mt-2">Nhập mã tham gia</div>
                    <div class="col-xl-8 col-lg-6 col-md-6 text-center">
                        <h1 class="text-white random-code">{{ code }}</h1>
                    </div>
                    <div class="col-xl-2 col-md-2 icon copy text-center mt-2">
                        <i class="ti ti-copy fs-2 text-white cursor-pointer" @click="copyCode"></i>
                    </div>
                </div>
                <div class="row d-flex p-4 pb-2 justify-center rounded-b-2xl">
                    <div class="col-md-6">
                        <button class="btn btn-light w-full fs-5">
                            Preview as a Student
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button @click="startGame" class="btn btn-primary w-full fs-5">
                            Bắt đầu
                        </button>
                    </div>
                </div>
                <div class="row d-flex justify-content-between p-4 pt-0">
                    <div class="col-md-6 mt-2" v-for="(item, index) in listUserJoined" :key="index">
                        <button class="btn btn-outline-secondary text-white w-full text-center">
                            <span class="text-primary fs-5">
                                {{ item.name ?? 'Sóc ẩn danh'}}
                            </span><span class="ms-2"> đã join</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full h-80-percent d-flex flex-column" v-if="showQuestion">
            <div class="row question-title d-flex flex-wrap justify-content-center align-items-center" style="flex:1;">
                <p class="text-white text-center fs-2">{{ listQuestion.findIndex(item => item.id == currentQuestion.id) + 1 }}. {{ currentQuestion.title }}</p>
                <h3 class="text-warning text-center fs-1">{{remainingTime }}</h3>
            </div>
            <div class="row list-answer justify-content-center align-items-center mt-2" style="flex:1;">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer d-flex align-items-center pe-0 ps-0" v-for="(item, index) in currentQuestion.answers"
                    :key="index">
                    <div class="list-answer-item w-full ms-2 p-3 d-flex align-items-center justify-content-center position-relative">
                        <span class="fs-5 text-white position-absolute right-0 top-0 btn btn-dark mt-2 me-2">{{index +
                            1}}</span>
                        <p class="text-white lh-base fs-2 pt-4 text-center">{{ item.answer }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-preview-result" v-if="showResult">
            <div class="d-flex justify-content-center">
                <div class="col-md-10 g-0">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane label="Tổng Quan" name="first">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-white">#</th>
                                        <th scope="col" class="fs-6 text-white">Tên</th>
                                        <th scope="col" class="fs-6 text-white">Điểm</th>
                                        <th scope="col" class="fs-6 text-white">Câu đúng</th>
                                        <th scope="col" class="fs-6 text-white text-center">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in listGamerResult" :key="index">
                                        <th scope="row" class="text-white">{{ index + 1 }}</th>
                                        <td class="text-white">{{ item.name }}</td>
                                        <td class="text-white">{{ item.gamer_answers_sum_score ?? 0 }}</td>
                                        <td class="text-white">{{ countQuestionTrue(item) }}</td>
                                        <td class="text-white text-center">
                                            <span :class="'badge rounded-pill width-2 ms-1 ' + getResultQuestionColor(item.gamer_answers, question.id).class" v-for="(question, key) in listQuestion" :key="key">
                                                <p>{{ 'Q' + (key + 1) }}</p>
                                                <p>{{ getResultQuestionColor(item.gamer_answers, question.id).score }}</p>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="Câu hỏi" name="second">
                            <div class="row pt-4 rounded rounded-5 body-answer-review ps-2">
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
                                                <RiCheckFill :color="answer.is_correct ? 'green' : 'red'"/>
                                                <label class="form-check-label text-white ms-2" for="flexCheckDefault">
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
        <div class="control-center mt-auto" v-show="showQuestion || showResult">
            <div class="control-center-container user-game-footer" translate="no" style="opacity: 1;">
                <div class="ring d-flex">
                    <div class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show">
                        <div class="coccoc-alo-ph-circle"></div>
                        <div class="coccoc-alo-ph-circle-fill"></div>
                        <div class="coccoc-alo-ph-img-circle"></div>
                    </div>
                    <span class="fs-4 text-primary text-center user-name-text me-3">
                        {{ listUserJoined.length + ' user'}}
                        <div class="fs-4 text-white user-name-text pt-1 rounded-1 border-2">{{ code }}</div>
                    </span>
                    <div class="divider hidden sm:block"></div>
                    <div>
                        <button class="btn btn-light fs-5 fw-bold font-600 text-dark ms-3 button-num-answer">{{ (listQuestion.findIndex(item => item.id === currentQuestion.id) + 1) + "/" + listQuestion.length }}
                        </button>
                    </div>
                    <div>
                        <button @click="nextQuestion(currentQuestion.id)"  v-if="showButtonNext" class="btn btn-primary text-white fs-5 fw-bold font-600 text-dark ms-3 button-num-answer">
                            Tiếp theo
                        </button>
                    </div>
                </div>
                <div class="control-center-actions"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
interface GamerInfo {
    id: string;
    name: string;
    created_at: string
}

import { defineComponent, ref, onBeforeUnmount } from "vue";
import type { TabsPaneContext } from 'element-plus';
import { useRoute } from "vue-router";
import api from "~/api/axios";
import type { Answer, ErrorResponse, GamerAnswer, GamerResult, ItemQuestion } from "~/constants/type";
import { HttpStatusCode } from "axios";
import { RiUser2Fill, RiCheckFill } from "@remixicon/vue";
import helperApp from "~/utils/helper";
import { RoomSetting, RoomStatus } from "~/constants/room";
import API_CONST from "~/utils/apiConst";
import type Echo from "laravel-echo";

definePageMeta({
    layout: "admin-game",
})

export default defineComponent({
    components: {
        RiUser2Fill,
        RiCheckFill,
    },
    setup() {
        const route = useRoute();
        const code = ref<string>('');
        const showPrepare = ref<boolean>(true);
        const showQuestion = ref<boolean>(false);
        const showResult = ref<boolean>(false);
        const listUserJoined = ref<Array<GamerInfo>>([]);
        const currentQuestion = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: ''
        });
        const listAnswer = ref<Array<Answer>>([]);
        const listQuestion = ref<Array<ItemQuestion>>([]);
        const activeName = ref<string>('first')
        const showButtonNext = ref<boolean>(false);
        const roomStatus = ref<number>(0);
        const listGamerResult = ref<Array<GamerResult>>([
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
        ]);
        const remainingTime = ref<number>(0);
        const remainingTimeReload = ref<number>(0);
        let intervalId: any;
        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        let countReload = ref<number>(0);

        const checkValidRoom = async () => {
            let roomId: string = route.params.roomId.toString();
            await api.room.checkValidRoom(
                roomId,
                (res: any) => {
                    code.value = res.room.code;
                    listUserJoined.value = res.room.gamers;
                    listQuestion.value = res.questions;
                    roomStatus.value = res.room.status;
                    if (res.room.status == RoomStatus.HAPPING) {
                        remainingTimeReload.value = res.time_remaining;
                        remainingTime.value = res.time_remaining;
                        if (countReload.value == 0) {
                            setShowResult(remainingTimeReload.value * 1000);
                            countReload.value ++;
                        }
                    }
                    listGamerResult.value = res.gamers;
                    currentQuestion.value = res.room.current_question_id ?
                        res.questions.find((item: ItemQuestion) => item.id == res.room.current_question_id) : res.questions[0];
                    ElLoading.service({ fullscreen: true }).close();
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    ElLoading.service({ fullscreen: true }).close();
                    if (err.code === HttpStatusCode.NotFound) {
                        return navigateTo("/not-found");
                    }
                }
            )
        }

        const startGame = async () => {
            ElLoading.service({ fullscreen: true });
            await api.room.startGame(
                route.params.roomId.toString(),
                (res: any) => {
                    showPrepare.value = false;
                    showQuestion.value = true;
                    remainingTime.value = RoomSetting.TIME_REPLY;
                    ElLoading.service({ fullscreen: true }).close();
                    showButtonNext.value = false;
                    setShowResult(RoomSetting.TIME_REPLY * 1000);
                    setTimeout(() => {
                        showButtonNext.value = true;
                    }, RoomSetting.TIME_REPLY * 1000);
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Warning", message: err.error.shift(), type: "warning"});
                    ElLoading.service({ fullscreen: true }).close();
                }
            )
        }

        const getRandomColor = () => {
            return helperApp.getRandomColor();
        }

        const nextQuestion = async (id: string) => {
            let nextQuestionIndex = listQuestion.value.findIndex((item: ItemQuestion) => item.id == id) + 1;
            if (nextQuestionIndex == listQuestion.value.length) {
                ElNotification({title: "Warming", message: "Bạn đã đi hết các câu hỏi", type: "warning"});

                return ;
            }
            ElLoading.service({ fullscreen: true });
            await api.room.nextQuestion(
                {
                    room_id: route.params.roomId.toString(),
                    question_id: id
                },
                (res: any) => {
                    ElLoading.service({ fullscreen: true }).close();
                    showButtonNext.value = false;
                    if (nextQuestionIndex < listQuestion.value.length) {
                        remainingTime.value = RoomSetting.TIME_REPLY;
                        currentQuestion.value = listQuestion.value[nextQuestionIndex];
                        showResult.value = false;
                        showQuestion.value = true;
                        calculateTimeReply();
                        setTimeout(async () => {
                            if (route.path.includes(API_CONST.FRONT_END.ADMIN_GAME)) {
                                await checkValidRoom();   
                            }
                            showButtonNext.value = true;
                            showResult.value = true;
                            showQuestion.value = false;
                        }, RoomSetting.TIME_REPLY * 1000);
                    }
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    ElLoading.service({ fullscreen: true }).close();
                }
            )
        }

        const setShowResult = (delay: number) => {
            showResult.value = false;
            showQuestion.value = true;
            calculateTimeReply();
            setTimeout(async () => {
                if (route.path.includes(API_CONST.FRONT_END.ADMIN_GAME)) {
                    await checkValidRoom();   
                }
                showButtonNext.value = true;
                showResult.value = true;
                showQuestion.value = false;
            }, delay);
        }

        const setRoomStatus = () => {
            if (roomStatus.value == RoomStatus.PREPARE) {
                showPrepare.value = true;
            }
            if (roomStatus.value == RoomStatus.HAPPING) {
                showPrepare.value = false;
                showQuestion.value = true;
            }
            if (roomStatus.value == RoomStatus.PENDING) {
                showPrepare.value = false;
                showResult.value = true;
                showButtonNext.value = true;
            }
            if (roomStatus.value == RoomStatus.PREPARE_FINISH) {
                showPrepare.value = false;
                showResult.value = true;
                showQuestion.value = false;
                showButtonNext.value = false;
            }
        }

        const countQuestionTrue = (item: GamerResult) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const getResultQuestionColor = (gamerAnswers: Array<GamerAnswer> | [], questionId: string) => {
            return helperApp.getColorOfQuestion(gamerAnswers, questionId);
        }

        const calculateTimeReply = () => {
            intervalId = setInterval(() => {
                if (remainingTime.value > 0) {
                    remainingTime.value--;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 1000 // 1 second
            );
        }

        const copyCode = () => {
            const textArea = document.createElement("textarea");
            textArea.value = code.value.toString();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            ElNotification({title: "Success", message: "Sao chép mã code thành công!", type: "success"});
        };

        onMounted(async () => {
            clearInterval(intervalId);
            ElLoading.service({ fullscreen: true });
            // @ts-ignore
            const { $echo }: Echo = useNuxtApp();
            await checkValidRoom();
            setRoomStatus();
            $echo.private('user.join-room.' + route.params.roomId.toString())
                .listen('UserJoinRoomEvent', (e: {gamers: GamerInfo[]}) => {
                    listUserJoined.value = e.gamers;
                });
        });

        onBeforeUnmount(() => {
            clearInterval(intervalId);
        });

        return {
            showPrepare,
            showQuestion,
            listAnswer,
            activeName,
            handleClick,
            showResult,
            code,
            startGame,
            listUserJoined,
            getRandomColor,
            listQuestion,
            currentQuestion,
            showButtonNext,
            nextQuestion,
            listGamerResult,
            countQuestionTrue,
            getResultQuestionColor,
            remainingTime,
            copyCode,
        }
    }
})
</script>
<style scoped lang="scss">
@import '~/assets/styles/admin/admin-game.scss';
</style>
