<template>
    <div>
        <div class="w-full" v-show="showQuestion">
            <div class="row question-title d-flex flex-wrap justify-content-center align-items-center">
                <p class="text-white text-center fs-2">{{ currentQuestion.title }}</p>
            </div>
            <div class="row list-answer justify-content-center align-items-center mt-4">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" v-for="(item, index) in currentQuestion.answers"
                    :key="index">
                    <div @click="submitAnswer(item.id)"
                        class="list-answer-item w-full ms-1 me-1 d-flex align-items-center justify-content-center position-relative">
                        <span
                            class="fs-5 text-white position-absolute right-0 top-0 btn btn-dark mt-2 me-2">{{index + 1}}</span>
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
                        <span class="fs-4 text-white user-name-text me-3 text-primary">
                            {{ gamerInfo?.name }}
                        </span>
                        <div class="divider hidden sm:block"></div>
                        <div>
                            <button
                                class="btn btn-light fs-5 fw-bold font-600 text-dark ms-3 button-num-answer">{{ currentQuestionIndex + 1 }}/{{ listQuestion.length }}</button>
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
        <!-- <div class="show-meme d-flex justify-content-center align-items-center">
        <img src="../../../../public/meme/sad/Screenshot from 2024-07-24 19-03-02.png" alt="meme" with="400" height="400" />
        </div> -->
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElLoading } from "element-plus";
import api from "~/server/api/axios";
import { useRoute } from "vue-router";
import type { ErrorResponse } from "~/constants/type";
import { HttpStatusCode } from "axios";

definePageMeta({
  layout: 'user-game'
})

interface Answer {
    id: number;
    answer: string;
    isCorrect: boolean;
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
  setup() {
    const route = useRoute();
    const listQuestion = ref<Array<ItemQuestion>>([]);
    const showQuestion = ref<boolean>(true);
    const showPreviewEnding = ref<boolean>(false);
    const gamerInfo = ref<GamerInfo>();
    const currentQuestion = ref<ItemQuestion>({
        id: '',
        title: '',
        quizze_id: '',
        answers: [],
        created_at: ''
    });
    const roomId = ref<string>('');
    const currentRoomStatus = ref<number>(0);
    const currentScore = ref<number>(0);
    const currentQuestionIndex = ref<number>(0);
    const currenListAnswer = ref<Array<Answer>>([
        {
            id: 1,
            answer: '1998',
            isCorrect: false,
            created_at: '2022-10-10 10:10:10'
        },
        {
            id: 2,
            answer: '2022',
            isCorrect: false,
            created_at: '2022-10-10 10:10:10'
        },
        {
            id: 3,
            answer: '2006',
            isCorrect: true,
            created_at: '2022-10-10 10:10:10'
        },
        {
            id: 4,
            answer: '2010',
            isCorrect: false,
            created_at: '2022-10-10 10:10:10'
        }
    ]);

    const getListQuestion = async () => {
        ElLoading.service({ fullscreen: true });
        await api.room.listQuestionOfRoom(
            route.params.tokenId.toString(),
            (res: any) => {
                listQuestion.value = res.questions;
                currentQuestion.value = listQuestion.value[currentQuestionIndex.value];
                gamerInfo.value = res.gamer;
                roomId.value = res.room.id;
                currentRoomStatus.value = res.room.status;
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

    const submitAnswer = async (id: number) => {
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
                ElNotification({title: "Error", message: err.error.shift(), type: "error"});
            }
        )
    }

    onMounted(async () => {
        const { $echo }: any = useNuxtApp();
        await getListQuestion();
        if (currentRoomStatus.value == 0) {
            ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' });
        }
        $echo.channel('admin.start-game.' + roomId.value)
            .listen('StartGameEvent', (e: any) => {
                ElLoading.service({ fullscreen: true, text: 'Chờ màn chơi bắt đầu!' }).close();
            });
    });

    return {
        currenListAnswer,
        showQuestion,
        showPreviewEnding,
        currentQuestion,
        currentQuestionIndex,
        listQuestion,
        gamerInfo,
        submitAnswer,
        currentScore,
    }
  }
})
</script>
<style scoped>
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