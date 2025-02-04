<template>
    <div class="row ms-4 me-4">
        <div class="app-email card h-100-vh">
            <div class="row g-0 h-100-vh">
                <el-dialog v-model="showModalDelete" :show-close="false" title="Warning" width="500" align-center>
                    <span>Bạn có chắc chắn muốn xóa bộ câu hỏi này?</span>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="showModalDelete = false">Hủy</el-button>
                            <el-button type="primary" @click="deleteQuizz">
                                Xác nhận
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- Modal Create Room -->
                <el-dialog v-model="showModalCreateRoom" :show-close="false" title="Tạo Room" width="500">
                    <div class="show-validate-message" v-if="errorMessageValidate.length > 0">
                        <div class="error-validate text-danger" v-for="(error, index) in errorMessageValidate" :key="index">{{ error }}</div>
                    </div>
                    <el-form-item label="Chọn kiểu chơi" :label-width="formLabelWidth">
                        <el-select :onchange="changeTypeRoom()" v-model="typeRoom" placeholder="Vui lòng chọn kiểu chơi!">
                            <el-option label="Kahoot" value="0" />
                            <el-option label="Homework" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="RoomType.HOMEWORK == typeRoom" label="Thời gian" :label-width="formLabelWidth" class="mt-2">
                        <el-date-picker class="w-full" v-model="timeRoom" type="datetimerange" start-placeholder="Start Date"
                        end-placeholder="End Date" :default-time="defaultTime" />
                    </el-form-item>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="showModalCreateRoom = false">Hủy</el-button>
                            <el-button type="primary" @click="createRoom()">
                                Tạo
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- End Modal Create Room -->
                <!-- show modal warning room is running -->
                <el-dialog v-model="showModalWarningRoomRunning" :show-close="false" title="Warning" width="500" align-center>
                    <span>{{ messageWarningRoomRunning }}</span>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button type="danger" @click="showModalWarningRoomRunning = false">Đóng</el-button>
                        </div>
                    </template>
                </el-dialog>
                 <!-- end show modal warning room is running  -->
                <!-- Show modal share quizz-->
                <el-dialog v-model="showModalShare" :show-close="false" title="Chia sẻ bộ câu hỏi" width="500" align-center>
                    <span>{{ messageWarningRoomRunning }}</span>
                    <div v-if="validateMessageEmailBeforeShare.length > 0">
                        <div class="error-validate text-danger" v-for="(error, index) in validateMessageEmailBeforeShare" :key="index">{{ error }}</div>
                    </div>
                    <el-form-item label="Email">
                        <el-input v-model="emailShare" />
                    </el-form-item>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="showModalShare = false">Hủy</el-button>
                            <el-button type="primary" @click="shareQuiz()">
                                Xác nhận
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- End show modal share-->
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
                            <li @click="changeTypeQuizFilter(item.id)" :class='"d-flex justify-content-between cursor-pointer " + (defaultTypeQuiz == item.id ? "active" : "")' data-target="inbox" v-for="(item, index) in getGetQuizType()">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i :class="item.icon"></i>
                                    <span class="align-middle ms-2">{{ item.text }}</span>
                                </a>
                                <div class="badge bg-label-primary rounded-pill badge-center" v-if="item.id == defaultTypeQuiz">
                                    {{ totalPageQuizzes }}
                                </div>
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
                        <div v-if="listQuizzes.length == 0" class="d-flex justify-content-center mt-4">
                            <h4 class="text-dark text-center">Chưa có bộ câu hỏi nào, hãy bấm tạo mới!</h4>
                        </div>
                        <div class="email-list pt-0">
                            <ul class="list-unstyled m-0">
                                <div class="email-list-item" data-starred="true" data-bs-toggle="sidebar"
                                    data-target="#app-email-view">
                                    <div v-if="listQuizzes.length > 0" class="d-flex align-items-center cursor-pointer border-custom"
                                        v-for="(item, index) in listQuizzes" :key="index">
                                        <div :class='"flex flex-col items-center " + (index % 2 == 0 ? "bg-primary" : "bg-success")'>
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
                                                <div class="row justify-content-between">
                                                    <div @click="navigateTo('/admin/dashboard/my-library/' + item.id)" class="col-md-9 title-content-list-answer ms-3 mb-0 mt-2 cursor-pointer">
                                                        <p class="text-start fs-5 fw-bold mb-0">{{ item.title }}</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="title-content-list-answer ms-3 d-flex justify-content-between col-md-7 mt-2">
                                                    <p class="text-start fs-6">{{ item.questions_count }} câu
                                                    </p>
                                                    <p class="text-start fs-6">{{ item.category?.name }}</p>
                                                    <p class="text-start fs-6">{{ item.rooms_count }} lượt chơi</p>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row d-flex justify-content-between">
                                                        <div
                                                            class="title-content-list-answer mb-0 d-flex justify-content-between col-md-6">
                                                            <p class="text-start fs-6 ms-3">{{ item.user ? item.user.name : '' }}</p>
                                                            <p class="text-start fs-6">{{
                                                                getRangeTimeCreateQuizz(item)
                                                                }}</p>
                                                        </div>
                                                        <div class="col-md-6 d-flex justify-content-end pe-4 btn">
                                                            <button @click="handleShowModalShare(item.id)" class="btn btn-link">
                                                                Chia sẻ
                                                            </button>
                                                            <button class="btn btn-primary ms-3"
                                                                @click="handleModalCreateRoom(item.id)">
                                                                Chơi ngay
                                                            </button>
                                                            <div class=" title-content-list-answer ms-3 mb-0 mt-2">
                                                        <el-dropdown class="float-end">
                                                            <span class="el-dropdown-link">
                                                                <RiMore2Fill class="more-icon" />
                                                            </span>
                                                            <template #dropdown>
                                                                <el-dropdown-menu>
                                                                    <el-dropdown-item
                                                                        @click="showModalDeleteQuizz(item.id)">
                                                                        <RiDeleteBin7Fill size="15" /><span
                                                                            class="mt-1"> Xóa</span>
                                                                    </el-dropdown-item>
                                                                </el-dropdown-menu>
                                                            </template>
                                                        </el-dropdown>
                                                    </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row pagination d-flex justify-content-center mt-3" v-if="listQuizzes.length > 0 && defaultTypeQuiz == 1">
                                        <el-pagination class="d-flex justify-content-center" :page-size="perpage"
                                            @change="handleCurrentChangeQuizze" background
                                            layout="prev, pager, next" :total="totalPageQuizzes" />
                                    </div>
                                    <div class="row pagination d-flex justify-content-center mt-3" v-if="listQuizzes.length > 0 && defaultTypeQuiz == typeSharedWithMe">
                                        <el-pagination class="d-flex justify-content-center" :page-size="perpage"
                                            @change="handleCurrentChangeQuizze" background
                                            layout="prev, pager, next" :total="totalPageQuizzes" />
                                    </div>
                                    <div class="row pagination d-flex justify-content-center mt-3" v-if="listQuizzes.length > 0 && defaultTypeQuiz == typeCreatedByMe">
                                        <el-pagination class="d-flex justify-content-center" :page-size="perpage"
                                            @change="handleCurrentChangeQuizze" background
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
import helperApp from "~/utils/helper";
import { RiMore2Fill, RiDeleteBin7Fill, RiCloseCircleLine } from "@remixicon/vue";
import { RoomType } from "~/constants/room";
import moment from "moment";
import { useMainStore } from '~/store';
import { CODE, RULES_VALIDATION } from "~/constants/application";
import { QUIZ_TYPE } from "~/constants/quiz";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    components: {
        RiMore2Fill,
        RiDeleteBin7Fill,
        RiCloseCircleLine,
    },
    setup() {
        const store = useMainStore();
        const listQuizzes = ref<Array<ItemQuizze>>([]);
        const totalPageQuizzes = ref<number>(0);
        const currentPageAll = ref<number>(1);
        const currentPageShared = ref<number>(1);
        const currentPageCreatedByMe = ref<number>(1);
        const currentQuizzId = ref<string>("");
        const showModalDelete = ref<boolean>(false);
        const showModalCreateRoom = ref<boolean>(false);
        const typeRoom = ref<number | "">();
        const formLabelWidth = '140px';
        const showModalWarningRoomRunning = ref<boolean>(false);
        const messageWarningRoomRunning = ref<string>("");
        const timeRoom = ref<Array<Date>>(
            [
                new Date(moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss")),
                new Date(moment().add(2, "hours").format("YYYY-MM-DD HH:mm:ss")),
            ]
        );
        const defaultTime = new Date();
        const errorMessageValidate = ref<Array<string> | []>([]);
        const perpage = ref<number>(7);
        const showModalShare = ref<boolean>(false);
        const currentQuizIdShare = ref<string>("");
        const emailShare = ref<string>("");
        const validateMessageEmailBeforeShare = ref<string[]>([]);
        const defaultTypeQuiz = ref<number>(QUIZ_TYPE.ALL.id);
        const typeSharedWithMe = ref<number>(QUIZ_TYPE.SHARE_WITH_ME.id);
        const typeCreatedByMe = ref<number>(QUIZ_TYPE.CREATED_BY_ME.id);

        const getListQuizzes = async () => {
            await api.quizze.list(
                { page: currentPageAll.value, type: defaultTypeQuiz.value },
                (res: any) => {
                    listQuizzes.value = res.data;
                    totalPageQuizzes.value = res.total;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            )
            ElLoading.service({ fullscreen: true }).close();
        }

        const changeTypeQuizFilter = async (quizType: number) => {
            if (defaultTypeQuiz.value != quizType) {
                currentPageAll.value = 1;
                defaultTypeQuiz.value = quizType;
                await getListQuizzes();
            }
        }

        const handleCurrentChangeQuizze = async (page: number) => {
            currentPageAll.value = page;
            await getListQuizzes();  
        }

        const createRoom = async () => {
            if (!validateFormCreateRoom()) {
                return ;
            }
            
            const params = typeRoom.value == RoomType.HOMEWORK ? {
                start_time: moment(new Date(timeRoom.value[0])).format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment(new Date(timeRoom.value[1])).format("YYYY-MM-DD HH:mm:ss"),
                type: typeRoom.value
            } : { type: typeRoom.value }

            await api.room.create(
                currentQuizzId.value,
                params,
                (res: any) => {
                    if (res.type == RoomType.HOMEWORK) {
                        return navigateTo("/admin/dashboard/reports/" + res.id);
                    }
                    
                    return navigateTo("/admin/dashboard/activity/" + res.id);
                },
                (err: ErrorResponse) => {
                    errorMessageValidate.value = err.error;
                }
            )
        }

        const validateFormCreateRoom = () => {
            let isPassValidate: boolean = true;
            let errrorMessage: string[] = [];

            if (!typeRoom.value) {
                errrorMessage.push("Bạn chưa chọn kiểu chơi!");
                isPassValidate = false;
            }

            if (typeRoom.value == RoomType.HOMEWORK) {
                if (!timeRoom.value) {
                    errrorMessage.push("Bạn chưa nhập thời gian bất đầu và kết thúc");
                    isPassValidate = false;
                    errorMessageValidate.value = errrorMessage;

                    return isPassValidate;
                }

                if (timeRoom.value[0] > timeRoom.value[1]) {
                    errrorMessage.push("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
                    isPassValidate = false;
                }

                let startTime = moment(new Date(timeRoom.value[0]));
                let endTime = moment(new Date(timeRoom.value[1]));

                if (startTime < moment(defaultTime) || endTime < moment(defaultTime)) {
                    errrorMessage.push("Thời gian bắt đầu và kết thúc phải lớn hơn thời gian hiện tại");
                    isPassValidate = false;
                }

                const rangeTimeSeconds = endTime.diff(startTime, 'minutes');
                if (rangeTimeSeconds < RULES_VALIDATION.ROOM.MIN_RANGLE_TIME || rangeTimeSeconds > RULES_VALIDATION.ROOM.MAX_RANGLE_TIME) {
                    errrorMessage.push('Thời gian diễn ra phải từ 1 đến 180 phút!');
                    isPassValidate = false;
                }   
            }
            errorMessageValidate.value = errrorMessage;

            return isPassValidate;
        }

        const getRangeTimeCreateQuizz = (item: ItemQuizze) => {
            return helperApp.calculateTimeAgo(item.created_at);
        }

        const showModalDeleteQuizz = (id: string) => {
            showModalDelete.value = true;
            currentQuizzId.value = id;
        }

        const deleteQuizz = async () => {
            await api.quizze.deleteQuizze(
                currentQuizzId.value,
                (res: any) => {
                    showModalDelete.value = false;
                    ElNotification({title: "Success", message: 'Xóa bộ câu hỏi thành công!', type: "success"});
                    getListQuizzes();
                },
                (err: ErrorResponse) => {
                    if (err.responseCode == CODE.ERROR_THROW.ROOM_IS_RUNNING) {
                        showModalWarningRoomRunning.value = true;
                        messageWarningRoomRunning.value = err.error.shift();
                    } else {
                        ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                    }
                }
            )
            showModalDelete.value = false;
        }

        const handleModalCreateRoom = (quizzeId: string) => {
            showModalCreateRoom.value = true;
            currentQuizzId.value = quizzeId;
            typeRoom.value = "";
            errorMessageValidate.value = [];
            timeRoom.value = [
                new Date(moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss")),
                new Date(moment().add(2, "hours").format("YYYY-MM-DD HH:mm:ss")),
            ];
        }

        const changeTypeRoom = () => {
            errorMessageValidate.value = [];
        }

        const handleShowModalShare = (id: string) => {
            emailShare.value = '';
            showModalShare.value = true;
            currentQuizIdShare.value = id;
        }

        const shareQuiz = async () => {
            if (!validateEmailShare()) {
                return ;
            }

            await api.quizze.shareQuiz(
                currentQuizIdShare.value,
                { email: emailShare.value },
                (res: any) => {
                    showModalShare.value = false;
                    ElNotification({title: "Success", message: 'Chia bạn bộ cảu hỏi thành công!', type: "success"});
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            )
        }

        const validateEmailShare = () => {
            let isPassValidate: boolean = true;
            let errorMessagesValidate: string[] = [];
            const validator = useValidator();
            let requiredEmail = validator.required(emailShare.value, "Email");
            alert(emailShare.value);
            let isLengthEmail = validator.isLength(
                emailShare.value,
                "Email",
                RULES_VALIDATION.EMAIL_LENGTH.MIN,
                RULES_VALIDATION.EMAIL_LENGTH.MAX,
                true
            );
            let isValidEmail = validator.isInvalidEmail(emailShare.value, false);
        
            if (requiredEmail != true) {
                errorMessagesValidate.push(requiredEmail);
                isPassValidate = false;
            }

            if (isLengthEmail != true) {
                errorMessagesValidate.push(isLengthEmail);
                isPassValidate = false;
            }

            if (isValidEmail != true) {
                errorMessagesValidate.push('Email không hợp lệ!');
                isPassValidate = false;
            }

            if (emailShare.value == store.$state.user?.email) {
                errorMessagesValidate.push('Không thể chia sẻ cho chính mình!');
                isPassValidate = false;
            }

            validateMessageEmailBeforeShare.value = errorMessagesValidate;

            return isPassValidate
        }

        const getGetQuizType = () => {
            return QUIZ_TYPE;
        }

        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getListQuizzes();
        });

        return {
            listQuizzes,
            totalPageQuizzes,
            currentPageAll,
            handleCurrentChangeQuizze,
            createRoom,
            getRangeTimeCreateQuizz,
            deleteQuizz,
            showModalDelete,
            showModalDeleteQuizz,
            showModalCreateRoom,
            handleModalCreateRoom,
            typeRoom,
            formLabelWidth,
            timeRoom,defaultTime,
            RoomType,
            changeTypeRoom,
            errorMessageValidate,
            showModalWarningRoomRunning,
            messageWarningRoomRunning,
            perpage,
            handleShowModalShare,
            showModalShare,
            emailShare,
            shareQuiz,
            validateMessageEmailBeforeShare,
            getGetQuizType,
            defaultTypeQuiz,
            changeTypeQuizFilter,
            currentPageShared,
            currentPageCreatedByMe,
            typeSharedWithMe,
            typeCreatedByMe,
        }
    }
})
</script>
<style scoped>
    .app-emails-list {
        background: #EFF4FB;
        padding: 0px 14px;
    }

    .border-custom {
        margin-top: 1rem;
        background: #fff;
        border-radius: 14px;
    }
</style>