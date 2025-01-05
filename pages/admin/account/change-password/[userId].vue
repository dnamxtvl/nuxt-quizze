<template>
    <div class="container">
      <div class="container-xxl flex-grow-1 container-p-y pt-1">
        <h4 class="fw-bold py-3"><span class="text-muted fw-light">Tài khoản /</span> Thông tin User</h4>
        <div class="row">
          <div class="col-md-12">
            <ul class="nav nav-pills flex-column flex-md-row mb-1">
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="`/admin/account/${$route.params.userId}`"
                  ><i class="ti-xs ti ti-users me-1"></i> Tài khoản
              </nuxt-link>
              </li>
              <li class="nav-item">
                <button class="nav-link active">
                  <i class="ti-xs ti ti-lock me-1"></i> Mật khẩu
                </button>
              </li>
            </ul>
            <div class="card mb-4">
              <h5 class="card-header">Đổi mật khẩu</h5>
                  <div class="card-body">
                    <form id="formAccountSettings" method="POST" onsubmit="return false">
                      <div class="row">
                        <div class="mb-3 col-md-6 form-password-toggle">
                          <label class="form-label" for="currentPassword">Mật khẩu hiện tại</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="mb-3 col-md-6 form-password-toggle">
                          <label class="form-label" for="newPassword">Mật khẩu mới</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                          </div>
                        </div>
                        <div class="mb-3 col-md-6 form-password-toggle">
                          <label class="form-label" for="confirmPassword">Xâc nhận lại mật khẩu</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                          </div>
                        </div>
                        <div class="col-12 mb-4">
                          <h6>Yêu cầu về mật khẩu:</h6>
                          <ul class="ps-3 mb-0">
                            <li class="mb-1">Có độ dài từ 6 đến 100 ký tự</li>
                          </ul>
                        </div>
                        <div>
                          <button type="submit" class="btn btn-primary me-2">Lưu thay đổi</button>
                          <button type="reset" class="btn btn-label-secondary">Hủy</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <!--/ Change Password -->
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