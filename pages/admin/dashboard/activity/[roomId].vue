<template>
    <div class="row position-absolute body-admin-game w-full">
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
                        <i class="ti ti-copy fs-2 text-white"></i>
                    </div>
                </div>
                <div class="row d-flex p-4 justify-center rounded-b-2xl">
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
                <div class="row d-flex justify-content-center" v-for="(item, index) in listUserJoined" :key="index">
                    <span class="text-white text-center">
                        <RiUser2Fill class="mb-2" :color="getRandomColor()" size="1.5em" /><span class="text-primary fs-4">{{ item.name
                            }}</span><span class="pb-2"> đã tham gia</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="w-full" v-show="showQuestion">
            <div class="row question-title d-flex flex-wrap justify-content-center align-items-center">
                <p class="text-white text-center fs-2">{{ currentQuestion.title }}</p>
            </div>
            <div class="row list-answer justify-content-center align-items-center mt-4">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" v-for="(item, index) in currentQuestion.answers"
                    :key="index">
                    <div class="list-answer-item w-full ms-1 me-1 d-flex align-items-center justify-content-center position-relative">
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
                        <span class="fs-4 text-white user-name-text me-3">
                            {{ listUserJoined.length}}
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
        <div class="table-preview-result" v-show="showResult">
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
                                        <th scope="col" class="fs-6 text-white">Câu đúng</th>
                                        <th scope="col" class="fs-6 text-white">Thời gian thực hiện(ms)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="text-white">1</th>
                                        <td class="text-white">Mark</td>
                                        <td class="text-white">Otto</td>
                                        <td class="text-white">@mdo</td>
                                        <td class="text-white">
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="text-white">2</th>
                                        <td class="text-white">Jacob</td>
                                        <td class="text-white">Thornton</td>
                                        <td class="text-white">@fat</td>
                                        <td class="text-white">
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" class="text-white">3</th>
                                        <td colspan="2" class="text-white">Larry the Bird</td>
                                        <td class="text-white">@twitter</td>
                                        <td class="text-white">
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
                                            <span class="badge rounded-pill bg-primary ms-1">
                                                <p>Q1</p>
                                                <p>2345</p>
                                            </span>
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
    </div>
</template>

<script lang="ts">
interface Answer {
    id: number;
    answer: string;
    is_correct: number;
}

interface gamerInfo {
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

import { defineComponent, ref } from "vue";
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from "vue-router";
import api from "~/server/api/axios";
import type { ErrorResponse } from "~/constants/type";
import { HttpStatusCode } from "axios";
import { RiUser2Fill, RiCheckFill } from "@remixicon/vue";
import helperApp from "~/utils/helper";
import { RoomStatus } from "~/constants/room";

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
        const listUserJoined = ref<Array<gamerInfo>>([]);
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

        const converBool = (value: number) => {
            return value == 1
        }
        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const checkValidRoom = async () => {
            ElLoading.service({ fullscreen: true });
            let roomId: string = route.params.roomId;
            await api.room.checkValidRoom(
                roomId,
                (res: any) => {
                    code.value = res.room.code;
                    listUserJoined.value = res.room.gamers;
                    listQuestion.value = res.questions;
                    roomStatus.value = res.room.status;
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
                    ElLoading.service({ fullscreen: true }).close();
                    showButtonNext.value = false;

                    setTimeout(() => {
                        showButtonNext.value = true;
                    }, 30000);
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

        const nextQuestion = async () => {
            
        }

        const setRoomStatus = () => {
            if (roomStatus.value == RoomStatus.HAPPING) {
                showPrepare.value = false;
                showQuestion.value = true;
            }
            if (roomStatus.value == RoomStatus.PENDING) {
                showButtonNext.value = true;
            }
        }

        onMounted(async () => {
            const { $echo }: any = useNuxtApp();
            await checkValidRoom();
            setRoomStatus();
            $echo.private('user.join-room.' + route.params.roomId.toString())
                .listen('UserJoinRoomEvent', (e: any) => {
                    listUserJoined.value = e.gamers;
                });
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
            converBool,
            currentQuestion,
            showButtonNext,
            nextQuestion,
        }
    }
})
</script>
<style scoped>
.table-preview-result .el-tab-pane {
    overflow-y: scroll;
    max-height: 920px;
}
.table {
    background-color: #090909cc;
}

.body-answer-review {
    background-color: #090909cc;
    border-radius: 1.5rem !important;
}

.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.body-admin-game {
    top: 80px;
    --bs-gutter-x: 0;
}

.join-code {
    background-color: #090909cc;
}

.join-code-body {
    background-color: #ffffff1a;
}

.random-code {
    font-size: 4rem;
}

.count-member {
    width: 50px;
    height: 50px;
    background-color: #ffffff0d;
}

.question-title {
    min-height: 350px;
    background-color: #00000080;
}
.list-answer-item {
    min-height: 340px;
    background-color: #00000080;
}
.user-name-text {
    padding-top: 60px;
}
.button-num-answer {
    margin-top: 55px;
}
.control-center {
    margin-top: 20px;
    background-color: #000;
    max-height: 160px;
}
.divider {
    background: #ffffff54;
    flex-shrink: 0;
    width: 2px;
    height: 70px;
    margin: auto 8px;
}
.show-meme {
    min-height: 800px;
}
.right-0 {
    right: 0;
}
@media screen and (max-width: 768px) {
    .list-answer-item {
        margin-top: 0.75rem;
        min-height: 100px;
    }
}
.coccoc-alo-ph-circle {
    width: 160px;
    height: 160px;
    top: 0px;
    left: 20px;
    position: absolute;
    background-color: transparent;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    border: 2px solid rgba(30, 30, 30, 0.4);
    opacity: .1;
    -webkit-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
    -moz-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
    -ms-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
    -o-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
    animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
}

.coccoc-alo-phone {
    background-color: transparent;
    width: 200px;
    height: 160px;
    cursor: pointer;
    z-index: 200000 !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    -webkit-transition: visibility .5s;
    -moz-transition: visibility .5s;
    -o-transition: visibility .5s;
    transition: visibility .5s;
    right: 150px;
    top: 10px;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-circle-fill {
    background-color: rgba(0, 175, 242, 0.5);
    opacity: .75 !important;
}

.coccoc-alo-ph-circle-fill {
    width: 100px;
    height: 100px;
    top: 30px;
    left: 50px;
    position: absolute;
    background-color: #000;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    border: 2px solid transparent;
    opacity: .1;
    -webkit-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
    -moz-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
    -ms-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
    -o-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
    animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
}

.coccoc-alo-ph-img-circle {
    width: 60px;
    height: 60px;
    top: 50px;
    left: 70px;
    position: absolute;
    background: rgba(30, 30, 30, 0.1) url(https://drive.google.com/uc?id=1V3N2b79QjDWetC_ss9wI3c-xpWDymn9R) no-repeat center center;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    border: 2px solid transparent;
    opacity: .7;
    -webkit-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
    -moz-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
    -ms-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
    -o-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
    animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-img-circle {
    background-color: #00aff2;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-circle {
    border-color: #00aff2;
    opacity: .5;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-circle,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-circle {
    border-color: #75eb50;
    opacity: .5;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-circle-fill,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-circle-fill {
    background-color: rgba(117, 235, 80, 0.5);
    opacity: .75 !important;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-img-circle,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-img-circle {
    background-color: #75eb50;
}

@-moz-keyframes coccoc-alo-circle-anim {
    0% {
        transform: rotate(0) scale(.5) skew(1deg);
        opacity: .1
    }
    30% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .5
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .1
    }
}

@-webkit-keyframes coccoc-alo-circle-anim {
    0% {
        transform: rotate(0) scale(.5) skew(1deg);
        opacity: .1
    }
    30% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .5
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .1
    }
}

@-o-keyframes coccoc-alo-circle-anim {
    0% {
        transform: rotate(0) scale(.5) skew(1deg);
        opacity: .1
    }
    30% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .5
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .1
    }
}

@keyframes coccoc-alo-circle-anim {
    0% {
        transform: rotate(0) scale(.5) skew(1deg);
        opacity: .1
    }
    30% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .5
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .1
    }
}

@-moz-keyframes coccoc-alo-circle-fill-anim {
    0% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .2
    }
    100% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
}

@-webkit-keyframes coccoc-alo-circle-fill-anim {
    0% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .2
    }
    100% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
}

@-o-keyframes coccoc-alo-circle-fill-anim {
    0% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .2
    }
    100% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
}

@keyframes coccoc-alo-circle-fill-anim {
    0% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg);
        opacity: .2
    }
    100% {
        transform: rotate(0) scale(.7) skew(1deg);
        opacity: .2
    }
}

@-moz-keyframes coccoc-alo-circle-img-anim {
    0% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    10% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    20% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    30% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    40% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg)
    }
}

@-webkit-keyframes coccoc-alo-circle-img-anim {
    0% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    10% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    20% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    30% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    40% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg)
    }
}

@-o-keyframes coccoc-alo-circle-img-anim {
    0% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    10% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    20% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    30% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    40% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg)
    }
}

@keyframes coccoc-alo-circle-img-anim {
    0% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    10% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    20% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    30% {
        transform: rotate(-25deg) scale(1) skew(1deg)
    }
    40% {
        transform: rotate(25deg) scale(1) skew(1deg)
    }
    50% {
        transform: rotate(0) scale(1) skew(1deg)
    }
    100% {
        transform: rotate(0) scale(1) skew(1deg)
    }
}

.bg-dark-with-opacity {
    background-color: #00000080;
}

.bg-dark {
    background-color: #000 !important;
}

.accuracy-bar-wrapper .accuracy-bar {
    height: 12px;
    margin-top: 8px;
    margin-bottom: 2px;
    display: flex;
    position: relative;
}

.accuracy-bar-wrapper .accuracy-bar .accuracy-success-fill {
    background-color: #00c985;
    border-radius: 8px 0 0 8px;
    width: 0;
    height: 16px;
    transition: width .2s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
}

.form-check {
    display: flex;
}

.bg-white {
    background-color: #f2f2f2 !important;
}
</style>