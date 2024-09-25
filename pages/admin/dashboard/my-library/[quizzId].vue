<template>
    <div class="container">
        <el-dialog v-model="showModalEditQuestion" close-icon="false" :close-on-click-modal="false" title="Cập nhật"
            width="500" align-center>
            <label for="inputPassword6" class="col-form-label fw-bold">Câu hỏi</label>
            <input type="text" class="form-control" v-model="currentQuestionUpdate.title"/>
            <div class="row mt-3">
                <span class="text-primary">
                    <label for="inputPassword6" class="col-form-label fw-bold">Câu trả lời</label>
                    <span v-if="currentQuestionUpdate.answers.length < maxAnswerOFQuestion" class="cursor-pointer" @click="addAnswerOfQuestion">
                        <RiAddCircleLine size="18" class="mb-1 ms-1" />
                    </span>
                </span>
                <div v-for="(checkbox, index) in currentQuestionUpdate.answers" :key="index" class="d-flex form-check mb-3 ms-2 pe-4">
                    <input class="form-check-input mt-2" type="checkbox" :id="'checkbox-' + index" v-model="checkbox.is_correct">
                    <input class="form-control form-check-label ms-1" :for="'checkbox-' + index" v-model="checkbox.answer">
                    <span v-if="currentQuestionUpdate.answers.length > minAnswerOFQuestion" class="text-danger cursor-pointer mt-2">
                        <RiCloseLine size="18" class="mb-1 ms-1" @click="removeAnswerOfQuestion(checkbox.id)" />
                    </span>
                  </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModalEditQuestion = false">
                        <RiCloseLine size="18"/>
                        Hủy
                    </el-button>
                    <el-button type="primary" @click="updateQuestion">
                    <RiEditFill size="18"/>
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- <el-dialog v-model="showModelEndGame" close-icon="false" :close-on-click-modal="false" title="Warning"
            width="500" align-center>
            <span class="text-center align-center">Bạn có muốn kết thúc bài kiểm tra ngay lập tức?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModelEndGame = false">Hủy</el-button>
                    <el-button type="primary" @click="endGame">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog> -->
        <!-- Header Section -->
        <div class="header">
            <div class="d-flex justify-content-start">
                <h4 class="text-dark">{{ quizDetail.title }}</h4>
            </div>
        </div>
        <!-- Invite Section -->
        <div class="row d-flex justify-content-between header-list-question">
            <div class="col-md-6">
                <h5 class="text-primary mb-0 pt-3">{{ listQuestions.length }} câu hỏi</h5>
            </div>
            <div class="col-md-6 d-flex justify-content-end">
                <button class="btn btn-primary text-white me-2 mt-2">
                    <RiAddLine size="18" class="mb-1" />
                    Thêm câu hỏi
                </button>
            </div>
        </div>
        <div class="players-card main-card">
            <div class="row pt-2 rounded rounded-5">
                <div class="col-lg-12 px-4 mb-2">
                    <div v-for="(item, index) in listQuestions"
                        class="question-preview-content border rounded rounded-3 pl-2 mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="col-md-9 d-flex justify-content-start mt-2">
                                <span class="text-black fw-normal fs-5 pt-2 px-4 text-start font-bold">
                                    {{ (index + 1) + ". " + item.title }}
                                </span>
                            </div>
                            <div class="col-md-3 d-flex justify-content-end mt-2">
                                <button @click="handleEditQuestion(item)" class="btn btn-primary text-white me-2 mt-2">
                                    <RiEditFill size="18" class="mb-1" />
                                    Sửa câu hỏi
                                </button>
                                <button class="btn btn-danger text-white me-2 mt-2">
                                    <RiDeleteBin2Fill size="17" class="mb-1" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                        <hr>
                        </hr>
                        <div class="d-flex justify-content-between question-answer-review px-4 pt-2 mb-2">
                            <div class="col-xl-9 col-lg-9 col-md-8 col-sm-6">
                                <div class="form-check" v-for="(answer, index) in item.answers">
                                    <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
                                    <label class="form-check-label ms-2" for="flexCheckDefault">
                                        {{ answer.answer }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { RiDeleteBin2Fill, RiEditFill, RiCheckFill, RiCheckboxCircleLine, RiQuestionLine, RiAddLine, RiCloseLine, RiAddCircleLine } from "@remixicon/vue";
import moment from "moment";
import { useRoute } from "vue-router";
import { ROOM_STATUS_TEXT } from "~/constants/room";
import { RULES_VALIDATION } from "~/constants/application";

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
    gamer_answers_sum_score: number;
    gamer_answers: Array<GamerAnswer> | [];
    gamer_token: GamerToken;
    created_at: string
}

interface ItemQuestion {
    id: string;
    title: string;
    quizze_id: string;
    answers: Array<Answer>;
    created_at: string;
}

interface GamerToken {
    id: string;
    token: string;
    submit_at: string|null;
    created_at: string
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

interface Quizz {
    id: string;
    title: string;
    category_id: number;
    created_at: string
    updated_at: string
}

export default defineComponent({
    components: {
        RiCheckboxCircleLine,
        RiQuestionLine,
        RiCheckFill,
        RiEditFill,
        RiDeleteBin2Fill,
        RiAddLine,
        RiCloseLine,
        RiAddCircleLine,
    },
    setup() {
        const route = useRoute();
        const showModelEndGame = ref<boolean>(false);
        const listQuestions = ref<ItemQuestion[]>([]);
        const defaultStringSort = ref<string>('ABCDEFGH');
        const quizDetail = ref<Quizz>({
            id: '',
            title: '',
            category_id: 0,
            created_at: '',
            updated_at: ''
        });
        const showModalEditQuestion = ref<boolean>(false);
        const currentQuestionUpdate = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: ''
        });
        const maxAnswerOFQuestion = RULES_VALIDATION.QUESTION.MAX_ANSWER;
        const minAnswerOFQuestion = RULES_VALIDATION.QUESTION.MIN_ANSWER;

        const getListQuestion = async () => {
            await api.quizze.listQuestion(
                route.params.quizzId as string,
                (res: any) => {
                    quizDetail.value = res[0].quizze;
                    listQuestions.value = res;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )

            ElLoading.service({ fullscreen: true }).close();
        }

        const countQuestionTrue = (item: GamerInfo) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const getResultQustionColor = (gamerAnswers: Array<GamerAnswer> | [], questionId: string) => {
            if (gamerAnswers.length == 0) {
                return {
                    score: 0,
                    class: "bg-warning"
                };
            }

            let answer = gamerAnswers.filter((answer: GamerAnswer) => answer.question_id == questionId);

            if (answer.length > 0) {
                let answersOfQuestion = listQuestions.value.find((item: ItemQuestion) => item.id == questionId)?.answers;
                if (answer[0].score > 0) {
                    return {
                        index: answersOfQuestion?.findIndex((item: Answer) => item.id == answer[0].answer_id),
                        score: answer[0].score,
                        class: "bg-success"
                    };
                }

                return {
                    index: answersOfQuestion?.findIndex((item: Answer) => item.id == answer[0].answer_id),
                    score: 0,
                    class: "bg-danger"
                }
            }
            
            return {
                score: 0,
                class: "bg-warning"
            };
        }

        const handleEditQuestion = (item: ItemQuestion) => {
            showModalEditQuestion.value = true;
            currentQuestionUpdate.value = {
                ...item,
                answers: item.answers.map(answer => ({
                    ...answer,
                    is_correct: !!answer.is_correct
                }))
            };
        }

        const formatDate = (date: string) => {
            return moment(date).format("DD/MM/YYYY HH:mm:ss");
        }

        const getStatusText = (status: number) => {
            return ROOM_STATUS_TEXT[status];
        }

        const removeAnswerOfQuestion = (answerId: number) => {
            currentQuestionUpdate.value.answers = currentQuestionUpdate.value.answers.filter((answer: Answer) => answer.id != answerId);
        }

        const addAnswerOfQuestion = () => {

        }
        
        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getListQuestion();
        });

        const validateQuestionUpdate = (question: ItemQuestion) => {

        }

        return {
            showModelEndGame,
            getListQuestion,
            formatDate,
            getStatusText,
            listQuestions,
            countQuestionTrue,
            getResultQustionColor,
            defaultStringSort,
            quizDetail,
            showModalEditQuestion,
            handleEditQuestion,
            currentQuestionUpdate,
            validateQuestionUpdate,
            addAnswerOfQuestion,
            maxAnswerOFQuestion,
            minAnswerOFQuestion,
            removeAnswerOfQuestion,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>