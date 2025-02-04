<template>
    <div class="container">
        <ShowQuestion ref="childRef" @update-question="updateQuestion" />
        <!-- Show modal delete question -->
        <el-dialog v-model="showModalDeleteQuestion" close-icon="false" :close-on-click-modal="false" title="Warning"
            width="500" align-center>
            <span class="text-center align-center">Bạn có muốn xóa câu hỏi này?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModalDeleteQuestion = false">Hủy</el-button>
                    <el-button type="primary" @click="removeQuestion">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- Show modal delete question -->
        <!-- Header Section -->
        <div class="header d-flex justify-content-between">
            <div class="d-flex justify-content-start">
                <h4 class="text-dark">{{ quizDetail.title }}</h4>
            </div>
            <div class="d-flex justify-content-start">
                <span @click="copyCode">
                    <RiFileCopyLine class="ms-3 cursor-pointer" />
                </span>
                <h4 class="text-success ms-2">{{ quizDetail.code }}</h4>
            </div>
        </div>
        <!-- Invite Section -->
        <div class="row d-flex justify-content-between header-list-question">
            <div class="col-md-6">
                <h5 class="text-primary mb-0 pt-3">{{ listQuestions.length }} câu hỏi</h5>
            </div>
            <div class="col-md-6 d-flex justify-content-end">
                <button @click="preparedQuestion" class="btn btn-primary text-white me-2 mt-2">
                    <RiAddLine size="18" class="mb-1" />
                    Thêm câu hỏi
                </button>
            </div>
        </div>
        <div class="players-card main-card">
            <div class="row pt-2 rounded rounded-5">
                <div class="col-lg-12 px-4 mb-2">
                    <Question :questionArray="listQuestions" @edit-question="handleEditQuestion"
                        @remove-question="handleRemoveQuestion" v-if="listQuestions.length > 0" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { Answer, ErrorResponse, GamerAnswer, GamerToken, ItemQuestion, Quizz } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { RiDeleteBin2Fill, RiEditFill, RiCheckFill, RiCheckboxCircleLine, RiQuestionLine, RiAddLine, RiCloseLine, RiAddCircleLine, RiArrowDownLine, RiArrowUpLine, RiFileCopyLine } from "@remixicon/vue";
import moment from "moment";
import { useRoute } from "vue-router";
import { ROOM_STATUS_TEXT } from "~/constants/room";
import { RULES_VALIDATION } from "~/constants/application";
import { useValidator } from "#imports";
import { useMainStore } from "~/store";
import Question from "~/components/admin/quiz/question.vue";
import ShowQuestion from "~/components/admin/quiz/show-question.vue";
import { useHead } from "@unhead/vue";
import Quill from "quill";
import { HttpStatusCode } from "axios";

definePageMeta({
    layout: "admin-dashboard",
})

interface GamerInfo {
    id: string;
    name: string;
    gamer_answers_sum_score: number;
    gamer_answers: Array<GamerAnswer> | [];
    gamer_token: GamerToken;
    created_at: string
}

declare global {
  interface Window {
    MathJax: any;
  }
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
        RiArrowDownLine,
        RiArrowUpLine,
        RiFileCopyLine,
        Question,
        ShowQuestion,
    },
    setup() {
        useHead({
            script: [
                {
                    src: "https://cdn.mathjax.org/mathjax/latest/MathJax.js",
                    async: false,
                },
            ],
        });
        const store = useMainStore();
        const authId = ref<string>(store.$state.user?.id as string);
        const route = useRoute();
        const showModelEndGame = ref<boolean>(false);
        const listQuestions = ref<ItemQuestion[]>([]);
        const defaultStringSort = ref<string>('ABCDEFGH');
        const quizDetail = ref<Quizz>({
            id: '',
            title: '',
            user_id: '',
            code: '',
            category_id: 0,
            created_at: '',
            updated_at: ''
        });
        const currentQuestion = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: ''
        });
        const maxAnswerOFQuestion = RULES_VALIDATION.QUESTION.MAX_ANSWER;
        const minAnswerOFQuestion = RULES_VALIDATION.QUESTION.MIN_ANSWER;
        const errorMessageUpdateQuestions = ref<string[]>([]);
        const isUpdate = ref<boolean>(false);
        const showModalDeleteQuestion = ref<boolean>(false);
        const currentQuestionIdDelete = ref<string>('');
        const childRef = ref();

        const getListQuestion = async () => {
            await api.quizze.listQuestion(
                route.params.quizzId as string,
                (res: any) => {
                    quizDetail.value = res[0].quizze;
                    listQuestions.value = res;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                    if (err.code === HttpStatusCode.NotFound) {
                        return navigateTo("/not-found");
                    }
                }
            )

            ElLoading.service({ fullscreen: true }).close();
        }

        const countQuestionTrue = (item: GamerInfo) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const handleEditQuestion = (params: {item: ItemQuestion, index: number}) => {
            currentQuestion.value = {
                ...params.item,
                answers: params.item.answers.map(answer => ({
                    ...answer,
                    is_correct: !!answer.is_correct
                }))
            };

            if (childRef.value) {
                childRef.value.handleEditQuestion(currentQuestion.value);
            }
        }

        const handleRemoveQuestion = (index: number) => {
            if (listQuestions.value.length == 1) {
                ElNotification({title: "Error", message: "Mỗi quiz cần có tối thiếu 1 câu hỏi!", type: "error"});
                return ;
            }
            currentQuestionIdDelete.value = listQuestions.value[index].id;
            showModalDeleteQuestion.value = true;
        }

        const removeQuestion = async () => {
            await api.quizze.deleteQuestion(currentQuestionIdDelete.value, (res: any) => {
                ElNotification({title: "Success",message: "Xóa câu hỏi thành công!",type: "success"});
                getListQuestion();
            }, (err: ErrorResponse) => {
                ElLoading.service({ fullscreen: true }).close();
                ElNotification({title: "Error", message: err.error.shift(),type: "error"});
            })
            
            showModalDeleteQuestion.value = false;
        }

        const formatDate = (date: string) => {
            return moment(date).format("DD/MM/YYYY HH:mm:ss");
        }

        const getStatusText = (status: number) => {
            return ROOM_STATUS_TEXT[status];
        }

        const removeAnswerOfQuestion = (answerId: number) => {
            currentQuestion.value.answers = currentQuestion.value.answers.filter((answer: Answer) => answer.id != answerId);
        }

        const addAnswerOfQuestion = () => {
            currentQuestion.value.answers.push({
                id: currentQuestion.value.answers.length > 0 ? currentQuestion.value.answers[currentQuestion.value.answers.length - 1].id + 1 : 1,
                answer: '',
                is_correct: false,
                created_at: '',
            });
        }

        const updateQuestion = async (params: {currentQuestionValue: ItemQuestion, isUpdateValue: boolean}) => {
            let isSuccess = true;
            if (params.isUpdateValue) {
                await api.quizze.updateQuestion(
                    params.currentQuestionValue.id,
                    params.currentQuestionValue,
                    (res: any) => {
                        ElNotification({title: "Success",message: "Cập nhật câu hỏi thành công!",type: "success"});
                    },
                    (err: ErrorResponse) => {
                        ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                        isSuccess = false;
                    }
                )
            } else {
                await api.quizze.createQuestion(
                    route.params.quizzId as string,
                    params.currentQuestionValue,
                    (res: any) => {
                        ElNotification({title: "Success",message: "Thêm câu hỏi thành công!",type: "success"});
                    },
                    (err: ErrorResponse) => {
                        ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                        isSuccess = false;
                    }
                )
            }

            if (isSuccess) await getListQuestion();
        }

        const preparedQuestion = () => {
            if (childRef.value) {
                childRef.value.handleAddQuestion();
            }
        }

        const copyCode = () => {
            const textArea = document.createElement("textarea");
            textArea.value = quizDetail.value.code.toString();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            ElNotification({title: "Success", message: "Sao chép mã code thành công!", type: "success"});
        };
        
        onMounted(async () => {
            window.MathJax = {
                jax: ["input/TeX", "output/SVG"],
                extensions: ["tex2jax.js"],
                SVG: {
                useGlobalCache: false,
                },
            };

            document.body.style.setProperty("--keyboard-zindex", "3000");
            const AlignStyle = Quill.import("attributors/style/align");
            Quill.register(AlignStyle, true);
            ElLoading.service({ fullscreen: true });
            await getListQuestion();
        });

        return {
            showModelEndGame,
            getListQuestion,
            formatDate,
            getStatusText,
            listQuestions,
            countQuestionTrue,
            defaultStringSort,
            quizDetail,
            handleEditQuestion,
            currentQuestion,
            addAnswerOfQuestion,
            maxAnswerOFQuestion,
            minAnswerOFQuestion,
            removeAnswerOfQuestion,
            errorMessageUpdateQuestions,
            updateQuestion,
            preparedQuestion,
            isUpdate,
            showModalDeleteQuestion,
            handleRemoveQuestion,
            removeQuestion,
            authId,
            copyCode,
            childRef,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>