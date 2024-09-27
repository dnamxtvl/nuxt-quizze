<template>
    <div class="container">
        <!-- Show modal accept question -->
        <el-dialog v-model="showModalAcceptQuiz" close-icon="false" :close-on-click-modal="false" title="Xác nhận"
            width="500" align-center>
            <span class="text-center align-center">
                Đồng ý nhận bộ câu hỏi
                <span class="text-primary">{{ quizDetail.title }}</span>
                này?
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="rejectQuiz">
                        Từ chối
                    </el-button>
                    <el-button type="success" @click="acceptShareQuiz">
                        Đồng ý
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- Show modal delete question -->
        <!-- Header Section -->
        <div class="header">
            <div class="d-flex justify-content-start">
                <h4 class="text-dark">{{ quizDetail.title }}</h4>
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
                                <span @click="handleEditQuestion(item)" class="text-primary text-white me-2 mt-2 cursor-pointer">
                                    <RiEditFill size="18" class="mb-1" />
                                </span>
                                <span @click="handleRemoveQuestion(item.id)" class="text-danger me-2 mt-2 cursor-pointer">
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
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import type { ErrorResponse } from "~/constants/type";
import { CODE } from "~/constants/application";
import type { Quizz } from "~/constants/type";


definePageMeta({
    layout: "admin-dashboard",
})

interface UserShare {
    id: number;
    is_accept: boolean;
    quiz: Quizz;
    receiver_id: string;
    user_share_id: string;
    token: string;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    components: {
    },
    setup() {
        const route = useRoute();
        const quizDetail = ref<Quizz>({
            id: '',
            title: '',
            category_id: 0,
            created_at: '',
            updated_at: ''
        });
        const userShareQuiz = ref<UserShare>({
            id: 0,
            is_accept: false,
            quiz: {
                id: '',
                title: '',
                category_id: 0,
                created_at: '',
                updated_at: ''
            },
            receiver_id: '',
            user_share_id: '',
            token: '',
            created_at: '',
            updated_at: ''
        });
        const showModalAcceptQuiz = ref<boolean>(false);

        const getDetailUserShare = async () => {
            await api.quizze.detailShareQuiz(
                route.params.token as string,
                route.query.notification_id ? route.query.notification_id as string : '',
                (res: any) => {
                    userShareQuiz.value = res;
                    quizDetail.value = res.quiz;
                    if (userShareQuiz.value.is_accept == true) {
                        return navigateTo("/admin/dashboard/my-library/" + quizDetail.value.id);
                    }

                    showModalAcceptQuiz.value = true
                },
                (err: ErrorResponse) => {
                    ElLoading.service({ fullscreen: true }).close();
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                    if (err.code == CODE.NOT_FOUND) {
                        return navigateTo("/not-found");
                    }
                }
            )
        }

        const acceptShareQuiz = async () => {
            await api.quizze.acceptShareQuiz(
                route.params.token as string,
                route.query.notification_id ? route.query.notification_id as string : '',
                (res: any) => {
                    ElLoading.service({ fullscreen: true }).close();
                    ElNotification({title: "Success",message: "Đã chấp nhận bộ cảu hỏi!",type: "success"});
                    return navigateTo("/admin/dashboard/my-library/" + quizDetail.value.id);
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )
        }

        const rejectQuiz = async () => {
            await api.quizze.rejectShareQuiz(
                route.params.token as string,
                route.query.notification_id ? route.query.notification_id as string : '',
                (res: any) => {
                    ElLoading.service({ fullscreen: true }).close();
                    ElNotification({title: "Success",message: "Đã từ chối bộ cảu hỏi!",type: "success"});
                    return navigateTo("/admin/dashboard/my-library/");
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )
        }

        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getDetailUserShare();
        });

        return {
            quizDetail,
            showModalAcceptQuiz,
            acceptShareQuiz,
            rejectQuiz,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>