<template>
    <div class="row ms-4 me-4">
        <div class="app-email card">
            <div class="row g-0">
                <!-- Email Sidebar -->
                <div class="col-lg-3 app-email-sidebar border-end flex-grow-0">
                    <div class="btn-compost-wrapper d-grid">
                        <button class="btn btn-primary btn-compose" data-bs-toggle="modal"
                            data-bs-target="#emailComposeSidebar">
                            Thư viện của tôi
                        </button>
                    </div>
                    <!-- Email Filters -->
                    <div class="email-filters py-2">
                        <!-- Email Filters: Folder -->
                        <ul class="email-filter-folders list-unstyled mb-4">
                            <li class="active d-flex justify-content-between" data-target="inbox">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-mail"></i>
                                    <span class="align-middle ms-2">Tất cả</span>
                                </a>
                                <div class="badge bg-label-primary rounded-pill badge-center">4
                                </div>
                            </li>
                            <li class="d-flex" data-target="sent">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-send ti-xs"></i>
                                    <span class="align-middle ms-2">Được chia sẻ với tôi</span>
                                </a>
                            </li>
                            <li class="d-flex" data-target="draft">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-file"></i>
                                    <span class="align-middle ms-2">Được tạo bởi tôi</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--/ Quiz Sidebar -->
                <!-- Quiz List -->
                <div class="col overflow-scroll app-emails-list">
                    <div class="shadow-none border-0">
                        <hr class="container-m-nx m-0" />
                        <!-- Email List: Items -->
                        <div class="email-list pt-0">
                            <ul class="list-unstyled m-0">
                                <div class="email-list-item" data-starred="true" data-bs-toggle="sidebar"
                                    data-target="#app-email-view">
                                    <div v-if="listQuizzes.length > 0" class="d-flex align-items-center" v-for="(item, index) in listQuizzes"
                                        :key="index">
                                        <div class="flex flex-col items-center bg-primary">
                                            <div class="h-18 w-18 relative rounded-sm overflow-hidden bg-lilac">
                                                <div class="v-image"><img
                                                        class="lazy-img rounded-inherit object-contain" alt="Quiz image"
                                                        width="100"
                                                        src="https://cf.quizizz.com/img/logos/new/logo_placeholder_sm.webp?w=100&amp;h=100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-quizz-content w-full">
                                            <div class="row flex-col h-full">
                                                <div class="title-content-list-answer ms-3 mb-0 mt-2">
                                                    <p class="text-start fs-5 fw-bold mb-0">{{ item.title }}</p>
                                                </div>
                                                <div
                                                    class="title-content-list-answer ms-3 d-flex justify-content-between col-md-7 mt-2">
                                                    <p class="text-start fs-6">{{ item.questions_count }} câu hỏi</p>
                                                    <p class="text-start fs-6">{{ item.category?.name }}</p>
                                                    <p class="text-start fs-6">{{ item.rooms_count }} lượt chơi</p>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row d-flex justify-content-between">
                                                        <div
                                                            class="title-content-list-answer mb-0 d-flex justify-content-between col-md-6">
                                                            <p class="text-start fs-6 ms-3">nam.dovan1</p>
                                                            <p class="text-start fs-6">2 tháng trước</p>
                                                        </div>
                                                        <div class="col-md-6 d-flex justify-content-end pe-4">
                                                            <button class="btn btn-link">
                                                                Chia sẻ
                                                            </button>
                                                            <button class="btn btn-primary ms-3"
                                                                @click="createRoom(item.id)">
                                                                Chơi ngay
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row pagination">
                                        <el-pagination class="d-flex justify-content-center" :page-size="6"
                                            @current-change="handleCurrentChangeQuizze" background
                                            layout="prev, pager, next" :total="totalPageQuizzes" />
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- /Quizzes List -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse, ItemQuizze } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    setup() {
        const listQuizzes = ref<Array<ItemQuizze>>([]);
        const totalPageQuizzes = ref<number>(0);
        const currentPage = ref<number>(1);

        const getListQuizzes = async () => {
            await api.quizze.list(
                { page: currentPage.value },
                (res: any) => {
                    ElLoading.service({ fullscreen: true }).close();
                    listQuizzes.value = res.data;
                    totalPageQuizzes.value = res.total;
                },
                (err: ErrorResponse) => {
                    ElLoading.service({ fullscreen: true }).close();
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )
        }

        const handleCurrentChangeQuizze = async (page: number) => {
            currentPage.value = page;
            await getListQuizzes();
        }

        const createRoom = async (id: string) => {
            await api.room.create(
                id,
                (res: any) => {
                    return navigateTo("/admin/dashboard/activity/" + res.id);
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )
        }

        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getListQuizzes();
        });

        return {
            listQuizzes,
            totalPageQuizzes,
            currentPage,
            handleCurrentChangeQuizze,
            createRoom,
        }
    }
})
</script>
<style scoped>
</style>