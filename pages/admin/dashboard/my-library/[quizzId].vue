<template>
    <div class="container">
        <el-dialog v-model="showModalCreateOrUpdateEditQuestion" close-icon="false" :close-on-click-modal="false" :title="isUpdate ? 'Cập nhật' : 'Tạo mới'"
            width="500" align-center>
            <div v-for="(error, index) in errorMessageUpdateQuestions" :key="index" class="text-danger" v-show="errorMessageUpdateQuestions.length > 0" >
                {{ error }}
            </div>
            <label for="inputPassword6" class="col-form-label fw-bold">Câu hỏi</label>
            <input type="text" class="form-control" v-model="currentQuestion.title"/>
            <div class="row mt-3">
                <span class="text-primary">
                    <label for="inputPassword6" class="col-form-label fw-bold">Câu trả lời</label>
                    <span v-if="currentQuestion.answers.length < maxAnswerOFQuestion" class="cursor-pointer" @click="addAnswerOfQuestion">
                        <RiAddCircleLine size="18" class="mb-1 ms-1" />
                    </span>
                </span>
                <div v-for="(checkbox, index) in currentQuestion.answers" :key="index" class="d-flex form-check mb-3 ms-2 pe-4">
                    <input class="form-check-input mt-2" type="checkbox" :id="'checkbox-' + index" v-model="checkbox.is_correct">
                    <input class="form-control form-check-label ms-1" :for="'checkbox-' + index" v-model="checkbox.answer">
                    <span v-if="currentQuestion.answers.length > minAnswerOFQuestion" class="text-danger cursor-pointer mt-2">
                        <RiCloseLine size="18" class="mb-1 ms-1" @click="removeAnswerOfQuestion(checkbox.id)" />
                    </span>
                  </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModalCreateOrUpdateEditQuestion = false">
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
            <div class="col-md-6 d-flex justify-content-end" v-if="authId == quizDetail.user_id">
                <button @click="handleAddQuestion" class="btn btn-primary text-white me-2 mt-2">
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
                                <span
                                    class="text-black fw-normal fs-5 pt-2 ps-4 pe-2 text-start font-bold">
                                    {{ (index + 1) + ". " }}
                                </span>
                                <div class="text-black fw-normal fs-5 pt-2 text-start font-bold" v-html="item.title"></div>
                            </div>
                            <div class="col-md-3 d-flex justify-content-end mt-2">
                                <span v-if="authId == quizDetail.user_id" @click="handleEditQuestion(item)" class="text-primary text-white me-2 mt-2 cursor-pointer">
                                    <RiEditFill size="18" class="mb-1" />
                                </span>
                                <span v-if="authId == quizDetail.user_id" @click="handleRemoveQuestion(item.id)" class="text-danger me-2 mt-2 cursor-pointer">
                                    <RiDeleteBin2Fill size="18" class="mb-1" />
                                </span>
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
    },
    setup() {
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
        const showModalCreateOrUpdateEditQuestion = ref<boolean>(false);
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

        const handleEditQuestion = (item: ItemQuestion) => {
            showModalCreateOrUpdateEditQuestion.value = true;
            isUpdate.value = true;
            errorMessageUpdateQuestions.value = [];
            currentQuestion.value = {
                ...item,
                answers: item.answers.map(answer => ({
                    ...answer,
                    is_correct: !!answer.is_correct
                }))
            };
        }

        const handleRemoveQuestion = (questionId: string) => {
            currentQuestionIdDelete.value = questionId;
            showModalDeleteQuestion.value = true;
        }

        const removeQuestion  = async () => {
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

        const updateQuestion = async () => {
            const resultValidate = validateQuestionUpdateOrCreate();
            if (!resultValidate) {
                return;
            }

            if (isUpdate.value) {
                await api.quizze.updateQuestion(
                    currentQuestion.value.id,
                    currentQuestion.value,
                    (res: any) => {
                        showModalCreateOrUpdateEditQuestion.value = false;
                        ElNotification({title: "Success",message: "Cập nhật câu hỏi thành công!",type: "success"});
                        getListQuestion();
                    },
                    (err: ErrorResponse) => {
                        ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                    }
                )
            } else {
                await api.quizze.createQuestion(
                    route.params.quizzId as string,
                    currentQuestion.value,
                    (res: any) => {
                        showModalCreateOrUpdateEditQuestion.value = false;
                        ElNotification({title: "Success",message: "Thêm câu hỏi thành công!",type: "success"});
                        getListQuestion();
                    },
                    (err: ErrorResponse) => {
                        ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                    }
                )
            }
        }

        const handleAddQuestion = () => {
            isUpdate.value = false;
            showModalCreateOrUpdateEditQuestion.value = true;
            errorMessageUpdateQuestions.value = [];
            currentQuestion.value = {
                id: '',
                title: '',
                quizze_id: route.params.quizzId as string,
                answers: [],
                created_at: ''
            };
            for (let i = 0; i < 4; i++) {
                 addAnswerOfQuestion();
            }
        }

        const validateQuestionUpdateOrCreate = () => {
            const validator = useValidator();
            let isPassvalidate: boolean = true;
            let errorMessagesValidate: string[] = [];
            if (currentQuestion.value.answers.length < minAnswerOFQuestion || currentQuestion.value.answers.length > maxAnswerOFQuestion) {
                errorMessagesValidate.push(`Câu hỏi phải có 2 đến 4 câu trả lời!`);
                isPassvalidate = false;
            }

            let counAnswerCorrect = currentQuestion.value.answers.filter((answer: Answer) => answer.is_correct).length;
            if (counAnswerCorrect == 0) {
                errorMessagesValidate.push(`Câu hỏi phải có ít nhất 1 đáp án đúng!`);
                isPassvalidate = false;
            }

            let requiredQuestionTitle = validator.required(currentQuestion.value.title.trim(), "Câu hỏi");
            let isLengthTitleQuestion = validator.isLength(
                currentQuestion.value.title,
                "Câu hỏi",
                RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH,
                RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH,
                true,
            );

            if (requiredQuestionTitle != true) {
                errorMessagesValidate.push(requiredQuestionTitle);
                isPassvalidate = false;
            }
            
            if (isLengthTitleQuestion != true) {
                errorMessagesValidate.push(isLengthTitleQuestion);
                isPassvalidate = false;
            }

            let defaultStringAnwser = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            currentQuestion.value.answers.forEach((answer: Answer, index: number) => {
                let requiredAnswer = validator.required(answer.answer.trim(), "Đáp án " + defaultStringAnwser[index]);
                let isLengthAnswer = validator.isLength(
                    answer.answer.trim(),
                    "Đáp án " + defaultStringAnwser[index],
                    RULES_VALIDATION.QUESTION.ANSWER.MIN_LENGTH,
                    RULES_VALIDATION.QUESTION.ANSWER.MAX_LENGTH,
                    true,
                );
                if (requiredAnswer != true) {
                    errorMessagesValidate.push(requiredAnswer);
                    isPassvalidate = false;
                }
                
                if (isLengthAnswer != true) {
                    errorMessagesValidate.push(isLengthAnswer);
                    isPassvalidate = false;
                }
            })
            
            errorMessageUpdateQuestions.value = errorMessagesValidate;

            return isPassvalidate;
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
            showModalCreateOrUpdateEditQuestion,
            handleEditQuestion,
            currentQuestion,
            validateQuestionUpdateOrCreate,
            addAnswerOfQuestion,
            maxAnswerOFQuestion,
            minAnswerOFQuestion,
            removeAnswerOfQuestion,
            errorMessageUpdateQuestions,
            updateQuestion,
            handleAddQuestion,
            isUpdate,
            showModalDeleteQuestion,
            handleRemoveQuestion,
            removeQuestion,
            authId,
            copyCode,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>