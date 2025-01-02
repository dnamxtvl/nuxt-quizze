<template>
    <div class="row position-relative body-admin-game w-full g-0">
        <!-- start model -->
        <el-dialog v-model="dialogVisible" :show-close="false" class="expand_qr" width="600"
            background-color="rgba(9, 9, 9, 0.8)">
            <div class="content px-4 pt-2 pb-2">
                <div class="col-12 mt-4">
                    <div class="col-12 text-white text-start mt-2 fs-5">Nhập mã tham gia</div>
                    <div class="text-start row">
                        <h1 class="col-7 text-white random-code">{{ code }}</h1>
                        <div class="col-2 icon copy text-center d-flex align-items-center mb-3">
                            <i class="ti ti-copy fs-2 text-white cursor-pointer" @click="copyCode"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 text-center d-flex align-items-center justify-content-center mt-3 mb-3 ">
                    <div class="position-relative">
                        <img :src="qrImage" alt="qrCode" class="w-30 expand-qr_img " @click="expandQR">
                        <div class="icon-close-model" @click="closeModelQR">&#215;</div>
                    </div>

                </div>
            </div>
        </el-dialog>

        <!--end model -->
        <el-dialog v-model="showModalCongratulations" class="fw-bold" title="CÂU TRẢ LỜI ĐÚNG!" width="500"
            :show-close="false" center>
            <div class="row d-flex justify-content-center text-success fw-bold">
                <RiCheckFill size="60" />
            </div>
            <div class="row d-flex justify-content-center">
                <h5 class="text-center">{{ currentCorrectAnswer }}</h5>
            </div>
        </el-dialog>
        <div class="row panel-wrapper d-flex rounded-4 justify-content-center prepare-join d-flex flex-col items-center ms-0 me-0"
            v-if="showPrepare && dialogVisible == false">
            <div
                class="col-xxl-5 col-xl-6 col-lg-7 col-md-9 col-10 join-code header row d-flex justify-content-center p-4 gap-4 bg-ds-dark-500-900 rounded ms-0 me-0">
                <div class="row d-flex join-code-body rounded">
                    <div class="col-xxl-8 col-xl-8 col-lg-8 col-md-9 col-12 mt-4">
                        <div class="text-white text-start mt-2 fs-5">Nhập mã tham gia</div>
                        <div class="text-start row">
                            <h1 class="col-xxl-9 col-xl-9 col-lg-9 col-md-8 text-white random-code">{{ code }}</h1>
                            <div class="col-2 icon copy text-center d-flex align-items-center mb-3">
                                <i class="ti ti-copy fs-2 text-white cursor-pointer" @click="copyCode"></i>
                            </div>
                        </div>
                    </div>
                    <div
                        class="col-xxl-4 col-xl-4 col-lg-4 col-md-3 col-12 text-center d-flex align-items-center justify-content-center position-relative">
                        <img :src="qrImage" alt="qrCode" class="w-30 qr-code-join-room" @click="expandQR">
                        <!-- <div :class="{ 'show-hover-icon': true }" class="hover-icon">
                            <RiArrowRightUpLine size="30" />
                        </div> -->
                    </div>
                </div>
                <div class="row d-flex p-4 pb-2 justify-center rounded-b-2xl">
                    <div class="col-md-6">
                        <button class="btn  w-full fs-5 btn-outline-secondary text-white">
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
                        <button class="btn  text-white w-full text-center btn-light">
                            <span class="text-primary text-break fs-4 fw-bold">
                                {{ item.name ?? 'Sóc ẩn danh' }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full d-flex flex-column" v-if="showQuestion">
            <div class="row d-flex flex-wrap justify-content-center align-items-center" style="flex:1;"
                :class="{ 'question-title': !displayChart }">
                <p class="text-dark text-center fs-2 py-4 question fw-bold lh-base">{{ listQuestion.findIndex(item =>
                    item.id ==
                    currentQuestion.id)
                    + 1 }}. {{ currentQuestion.title }}</p>
                <h3 v-if="displayTime" class="text-warning text-start fs-1 px-5">
                    <span class="remaining_time">{{ remainingTime }}</span>
                </h3>
            </div>
            <div v-if="displayChart" style="background-color: rgba(0, 0, 0, 0.3);" class="pt-2">
                <BarChart :getDataChart="getDataChart" />
            </div>
            <div class="row list-answer align-items-center mt-2 px-3" style="flex:1;">
                <div class="col-6 col-sm-6 col-md-6 col-lg-6 cursor-pointer d-flex align-items-center pe-0 ps-0 mb-2"
                    v-for="(item, index) in currentQuestion.answers" :key="index">
                    <div class="list-answer-item w-full ms-2 p-3 d-flex align-items-center justify-content-center position-relative"
                        :style="{ background: backgroundColorAnswers[index] }"
                        :class="{ 'opacity_5': !item.is_correct && displayChart }">
                        <span class="fs-3 text-white position-absolute  btn btn-dark mt-2 me-2 border-0"
                            :style="{ background: backgroundColorAnswers[index] }" style="left: 0; top: 0">{{ index +
                            1 }}</span>
                        <p class="text-white lh-base fs-2 pt-4 text-center">{{ item.answer }}</p>
                        <span v-if="item.is_correct && displayChart"
                            class="fs-3 text-white position-absolute me-4 border-0" style="right: 0;">
                            <RiCheckFill size="40" class="fw-bold" />
                        </span>
                        <span v-if="!item.is_correct && displayChart"
                            class="fs-3 text-white position-absolute me-4 border-0" style="right: 0;">
                            <RiCloseFill size="40" class="fw-bold" />
                        </span>
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
                                        <th scope="col" class="text-white text-center">Xếp hạng</th>
                                        <th scope="col" class="fs-6 text-white text-center">Tên</th>
                                        <th scope="col" class="fs-6 text-white text-center">Tổng Điểm</th>
                                        <th scope="col" class="fs-6 text-white text-center">Số Câu đúng</th>
                                        <th scope="col" class="fs-6 text-white text-center text-center">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in listGamerResult" :key="index">
                                        <th scope="col" class="text-white text-center">{{ index + 1 }}</th>
                                        <td scope="col" class="text-white text-center">{{ item.name ?? 'Sóc ẩn danh' }}
                                        </td>
                                        <td scope="col" class="text-white text-center">{{ item.gamer_answers_sum_score
                                            ?? 0 }}</td>
                                        <td scope="col" class="text-white text-center">{{ countQuestionTrue(item) }}
                                        </td>
                                        <td scope="col" class="text-white text-center">
                                            <span
                                                :class="'badge rounded-pill width-2 ms-1 ' + getResultQuestionColor(item.gamer_answers, question.id).class"
                                                v-for="(question, key) in listQuestion" :key="key">
                                                <p>{{ 'Q' + (key + 1) }}</p>
                                                <p>{{ getResultQuestionColor(item.gamer_answers, question.id).score }}
                                                </p>
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
                                                <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
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
            <div class="control-center-container user-game-footer d-flex " translate="no" style="opacity: 1;">
                <div class="ring d-flex w-full justify-content-start align-items-center ps-5">
                    <span class="fs-4 text-white user-name-text pt-1 rounded-1 border-2">RoomID: {{ code }}</span>
                    <div class="divider hidden sm:block"></div>
                    <span class="fs-4 text-primary text-center user-name-text ">
                        {{ listUserJoined.length + ' user' }}
                        <!-- <div class="fs-4 text-white user-name-text pt-1 rounded-1 border-2">{{ code }}</div> -->
                    </span>
                    <div class="divider hidden sm:block"></div>
                    <div>
                        <button class="btn btn-light fs-5 fw-bold font-600 text-dark ">{{
                            (listQuestion.findIndex(item => item.id === currentQuestion.id) + 1) + "/" +
                            listQuestion.length }}
                        </button>
                    </div>
                    <div class="ms-auto">
                        <button @click="nextQuestion(currentQuestion.id)" v-if="showButtonNext"
                            class="btn btn-primary text-white fs-5 fw-bold font-600 text-dark me-5">
                            Tiếp theo
                        </button>
                        <button @click="displayResult()" v-if="showButtonDisplayResult"
                            class="btn btn-primary text-white fs-5 fw-bold font-600 text-dark me-5">
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
import { RiUser2Fill, RiCheckFill, RiArrowRightUpLine, RiCloseFill, } from "@remixicon/vue";
import helperApp from "~/utils/helper";
import { RoomSetting, RoomStatus } from "~/constants/room";
import API_CONST from "~/utils/apiConst";
import type Echo from "laravel-echo";
import QRCode from 'qrcode';
import BarChart from "./BarChart.vue";

definePageMeta({
    layout: "admin-game",
})

export default defineComponent({
    components: {
        RiUser2Fill,
        RiCheckFill,
        RiArrowRightUpLine,
        BarChart,
        RiCloseFill
    },
    setup() {
        const config = useRuntimeConfig();
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
        const qrImage = ref<string>('');
        const showModalCongratulations = ref<boolean>(false);
        const currentCorrectAnswer = ref<string>('');
        let intervalId: any;
        const handleClick = (tab: TabsPaneContext, event: Event) => {
            
        }
        const dialogVisible = ref<boolean>(false);
        const hiddenIfDisplayModelExpand = ref<boolean>(true);
        const backgroundColorAnswers = ref<string[]>([
            '#E21B3C',
            '#D89E00',
            '#1368CE',
            '#26890C'
        ]);

        let countReload = ref<number>(0);
        const displayTime = ref<boolean>(true);
        const displayChart = ref<boolean>(false);
        const showButtonDisplayResult = ref<boolean>(false);
        const getDataChart = ref<Array<any>>([]);

        const checkValidRoom = async () => {
            let roomId: string = route.params.roomId.toString();
            await api.room.checkValidRoom(
                roomId,
                (res: any) => {
                    if (res.list_current_answers.length !== 0) {
                        getDataChart.value = res.list_current_answers.map((item: any, index : int) => {
                            return item.gamer_answers_count;
                        });
                    }
                    code.value = res.room.code;
                    if (res.room.gamers.length > 0) {
                        listUserJoined.value = res.room.gamers.filter( (item: any) => item.name != null)
                    }
                    listQuestion.value = res.questions;
                    roomStatus.value = res.room.status;
                    if (res.room.status == RoomStatus.HAPPING) {
                        remainingTimeReload.value = res.time_remaining;
                        remainingTime.value = res.time_remaining;
                        if (countReload.value == 0) {
                            setShowResult(remainingTimeReload.value * 1000);
                            countReload.value++;
                        }
                    }
                    if (res.gamers.length > 0) {
                        listGamerResult.value = res.gamers.filter((item: any) => item.name != null);
                    }
                    currentQuestion.value = res.room.current_question_id ?
                        res.questions.find((item: ItemQuestion) => item.id == res.room.current_question_id) : res.questions[0];
                    ElLoading.service({ fullscreen: true }).close();
                },
                (err: ErrorResponse) => {
                    ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
                    ElLoading.service({ fullscreen: true }).close();
                    if (err.code === HttpStatusCode.NotFound) {
                        return navigateTo("/not-found");
                    }
                    if (err.code === HttpStatusCode.Forbidden) {
                        return navigateTo("/error/unauthorized");
                    }
                }
            )
        }

        const startGame = async () => {
            ElLoading.service({ fullscreen: true });
            showModalCongratulations.value = false;
            await api.room.startGame(
                route.params.roomId.toString(),
                (res: any) => {
                    showPrepare.value = false;
                    showQuestion.value = true;
                    remainingTime.value = RoomSetting.TIME_REPLY;
                    ElLoading.service({ fullscreen: true }).close();
                    showButtonNext.value = false;
                    showButtonDisplayResult.value = false;
                    setShowResult(RoomSetting.TIME_REPLY * 1000);
                    setTimeout(() => {
                        // showButtonNext.value = true;
                        showButtonDisplayResult.value = true;
                    }, RoomSetting.TIME_REPLY * 1000);
                },
                (err: ErrorResponse) => {
                    ElNotification({ title: "Warning", message: err.error.shift(), type: "warning" });
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
                ElNotification({ title: "Warming", message: "Bạn đã đi hết các câu hỏi", type: "warning" });
                showButtonNext.value = false;
                return;
            }
            ElLoading.service({ fullscreen: true });
            showModalCongratulations.value = false;
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
                        displayTime.value = true;
                        calculateTimeReply();
                        setTimeout(async () => {
                            if (route.path.includes(API_CONST.FRONT_END.ADMIN_GAME)) {
                                await checkValidRoom();
                            }
                            displayChart.value = true;
                            showButtonDisplayResult.value = true;
                            displayTime.value = false;
                            // showButtonNext.value = true;
                            // showResult.value = true;
                            // showQuestion.value = false;
                            // getCurrentCorrectAnswerText();
                        }, RoomSetting.TIME_REPLY * 1000);
                    }
                },
                (err: ErrorResponse) => {
                    ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
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
                displayTime.value = false;
                displayChart.value = true;
                showButtonDisplayResult.value = true;
                
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
            }, 1000
            );
        }

        const copyCode = () => {
            const textArea = document.createElement("textarea");
            textArea.value = code.value.toString();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            ElNotification({ title: "Success", message: "Sao chép mã code thành công!", type: "success" });
        };

        const generateQR = async (text: string) => {
            try {
                qrImage.value = await QRCode.toDataURL(text);
            } catch (err) {
                console.error(err)
            }
        }

        const getCurrentCorrectAnswerText = () => {
            if (currentQuestion.value.id != '') {
                let answerCorrect = currentQuestion.value.answers.find((item: Answer) => item.is_correct == true);
                if (answerCorrect) {
                    showModalCongratulations.value = true;
                    currentCorrectAnswer.value = answerCorrect?.answer;
                }
            }
        }

        onMounted(async () => {
            clearInterval(intervalId);
            ElLoading.service({ fullscreen: true });
            // @ts-ignore
            const { $echo }: Echo = useNuxtApp();
            await checkValidRoom();
            await generateQR(config.public.FRONTEND_URL + 'user/join?gc=' + code.value);
            setRoomStatus();
            $echo.private('user.join-room.' + route.params.roomId.toString())
                .listen('UserJoinRoomEvent', (e: { gamer: GamerInfo }) => {
                    listUserJoined.value.push(e.gamer);
                });

            const { $bus }: any = useNuxtApp();
            $bus.$on('lostConnection', (data: {}) => {
                ElNotification({ title: "Error", message: "Bạn đang offline!", type: "error", duration: 0 });
            });

            $bus.$on('reconnected', (data: {}) => {
                ElNotification.closeAll();
                ElNotification({ title: "Reconected", message: "Đã khôi phục kết nối!", type: "success", duration: 3000 });
                checkValidRoom();
            });
        });

        onBeforeUnmount(() => {
            clearInterval(intervalId);
            showModalCongratulations.value = false;
        });

        const expandQR = () => {
            dialogVisible.value = true;
        }

        const closeModelQR = () => {
            dialogVisible.value = false;
            hiddenIfDisplayModelExpand.value = true;
        }

        const displayResult = () => {
            showButtonNext.value = true;
            showResult.value = true;
            showQuestion.value = false;
            displayChart.value = false;
            showButtonDisplayResult.value = false;
        }

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
            qrImage,
            showModalCongratulations,
            currentCorrectAnswer,
            expandQR,
            dialogVisible,
            hiddenIfDisplayModelExpand,
            isHovered: false,
            closeModelQR,
            backgroundColorAnswers,
            displayTime,
            displayChart,
            showButtonDisplayResult,
            displayResult,
            getDataChart
        }
    }
})
</script>
<style scoped lang="scss">
@import '~/assets/styles/admin/admin-game.scss';

.expand-qr_img {
    height: 350px;
}

.expand_qr .content {
    background-color: #4CAF50 !important;
}

.qr-code-join-room:hover {
    opacity: 0.8;
    cursor: pointer;
}

.icon-close-model {
        position: absolute;
        font-size: 36px;
        height: 40px;
        width: 40px;
        background: #2f2f2f;
        border-radius: 50%;
        text-align: center;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        top: -20px;
        right: -20px;
        opacity: 0.8;
        color: #fff;
}

.icon-close-model:hover {
    cursor: pointer;
}

.el-dialog__header{
    display: none !important;
}

.score_list {
    width: 80% ;
    margin: 12px auto;
    height: 350px;
    max-width: 750px ;
}
.score_item {
    width: 128px;
}
.content_item {
    background-color: #e21b3c;
    height: 230px;
    width: 100%;
}
.footer_item {
    background-color: #af152e;
    height: 32px;
    width: 100%;
}
.opacity_5 {
    opacity: 0.5;
}
.list-answer-item {
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}
</style>
