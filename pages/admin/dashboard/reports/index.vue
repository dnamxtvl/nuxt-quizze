<template>
    <div class="row ms-4 me-4">
        <div class="">
            <div class="row g-0">
                <el-dialog v-model="showModalDelete" :show-close="false" title="Warning" width="500" align-center>
                    <span>Bạn có chắc chắn muốn xóa room này?</span>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="showModalDelete = false">Hủy</el-button>
                            <el-button type="primary" @click="deleteRoom">
                                Xác nhận
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- Email Sidebar -->

                <!--/ Quiz Sidebar -->
                <!-- Room List -->
                <div class="col app-emails-list">
                    <div class="shadow-none border-0">
                        <hr class="container-m-nx m-0" />
                        <!-- Email List: Items -->
                        <div class="row g-3 align-items-center mt-0 ms-2 mb-2 filter-report">
                            <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                                <label for="inputPassword6" class="col-form-label">Loại</label>
                                <select class="form-control" v-model="filterParams.type">
                                    <option value="">Chọn loại</option>
                                    <option v-for="(value, key) in roomTypesArray" :key="value" :value="key">
                                        {{ roomType[key] }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                                <label for="inputPassword6" class="col-form-label">Mã bộ câu hỏi</label>
                                <input type="text" v-model="filterParams.code_quiz" placeholder="Nhập code"
                                    class="form-control" aria-describedby="passwordHelpInline">
                            </div>
                            <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                                <label for="inputPassword6" class="col-form-label">Mã phòng</label>
                                <input type="text" v-model="filterParams.code" placeholder="Nhập code"
                                    class="form-control" aria-describedby="passwordHelpInline">
                            </div>
                            <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                                <label for="inputPassword6" class="col-form-label">Trạng thái</label>
                                <select class="form-control" v-model="filterParams.status">
                                    <option value="">Chọn trạng thái</option>
                                    <option v-for="(value, key) in roomStatusArray" :key="value" :value="key">
                                        {{ getStatusText(key)?.text }}
                                    </option>
                                </select>
                            </div>
                            <el-form-item class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 mt-2 pt-2 align-items-center">
                                <label for="inputPassword6" class="col-form-label">Thời gian</label>
                                <el-date-picker style="height: 38px;" class="w-full" v-model="filterParams.time_report"
                                    type="datetimerange" start-placeholder="Start Date" end-placeholder="End Date"
                                    :default-time="defaultTime" />
                            </el-form-item>
                            <div class="col-xxl-1 col-xl-2 col-lg-4 col-md-6 mt-4 pt-1 d-flex">
                                <div @click="getListRoomReport" class="cursor-pointer mt-4">
                                    <RiSearchLine class="text-primary pt-0 pb-0" />
                                </div>
                                <span @click="resetFilter" class="ms-1 mt-4"><RiRefreshLine size="20" class="text-danger cursor-pointer" /></span>
                            </div>
                        </div>
                        <table class="table" v-if="listRoom.length > 0">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-dark">#</th>
                                    <th scope="col" class="fs-6 text-dark text-start">Loại</th>
                                    <th scope="col" class="fs-6 text-dark">Tên Quizz</th>
                                    <th scope="col" class="fs-6 text-dark text-center">Số người tham gia</th>
                                    <th scope="col" class="fs-6 text-dark">Câu đúng</th>
                                    <th scope="col" class="fs-6 text-dark text-center">Mã phòng</th>
                                    <th scope="col" class="fs-6 text-dark text-center">Trạng thái</th>
                                    <th scope="col" class="fs-6 text-dark text-center">Ngày tạo</th>
                                    <th scope="col" class="fs-6 text-dark text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="cursor-pointer" @click="navigateTo(`/admin/dashboard/reports/${item.id}`)"
                                    v-for="(item, index) in listRoom" :key="index">
                                    <th scope="row" class="text-dark">{{ index + 1 }}</th>
                                    <td class="text-dark text-start">
                                        <span
                                            :class='"badge text-white " + (item.type == roomType.KAHOOT ? "bg-primary" : "bg-success")'>
                                            {{ item.type == roomType.KAHOOT ? 'KAHOOT' : 'HOMEWORK' }}
                                        </span>
                                    </td>
                                    <td class="text-dark">{{ item.quizze?.title }}</td>
                                    <td class="text-dark text-center">{{ item.gamers_count }}</td>
                                    <td>
                                        <div class="badge text-dark">
                                            <span><el-progress stroke-width="4" width="30" type="circle"
                                                    :percentage="item.gamer_answers_count > 0 ? Math.round(item.total_correct * 100 / item.gamer_answers_count) : 0"
                                                    status="success" /></span>
                                            <span class="ms-1">{{ item.gamer_answers_count > 0 ?
                                                Math.round(item.total_correct * 100 /
                                                item.gamer_answers_count) : 0 }}%</span>
                                        </div>
                                    </td>
                                    <td class="text-center">{{ item.code }}</td>
                                    <td class="text-white text-center">
                                        <span :class='"text-start badge " + getStatusText(item.status).className'>
                                            {{ getStatusText(item.status).text }}
                                        </span>
                                    </td>
                                    <td class="text-dark text-center">
                                        {{ formatDate(item.created_at) }}
                                    </td>
                                    <td class="text-center">
                                        <el-dropdown class="float-end">
                                            <span class="el-dropdown-link">
                                                <RiMore2Fill class="more-icon" />
                                            </span>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item @click="showModalDeleteRoomReport(item.id)">
                                                        <RiDeleteBin7Fill size="15" class="me-1" /><span class="mt-1"> Xóa</span>
                                                    </el-dropdown-item>
                                                    <nuxt-link :to='"/admin/dashboard/my-library/" + item.quizze?.id'>
                                                        <el-dropdown-item>
                                                            <RiEyeCloseFill size="15" class="me-1" /><span class="mt-1"> Xem câu hỏi</span>
                                                        </el-dropdown-item>
                                                    </nuxt-link>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty-section mt-4" v-if="listRoom.length == 0">
                        <h4 class="text-center">Không tìm thấy kết quả!</h4>
                    </div>
                    <div class="row pagination mt-1" v-if="listRoom.length > 0">
                        <el-pagination class="d-flex justify-content-center" :page-size="defalutPerpage"
                            @current-change="handleCurrentChangeReport" background layout="prev, pager, next"
                            :total="totalRoomReport" />
                    </div>
                </div>
                <!-- /Quizzes List -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { RiMore2Fill, RiDeleteBin7Fill, RiRefreshLine, RiEyeCloseFill, RiSearchLine } from "@remixicon/vue";
import { RoomSetting, RoomStatus, RoomType } from "~/constants/room";
import { ROOM_STATUS_TEXT } from "~/constants/room";
import moment from "moment";

definePageMeta({
    layout: "admin-dashboard",
})

interface Room {
    id: string;
    code: string;
    started_at: string;
    ended_at: string;
    status: RoomStatus;
    type: RoomType;
    gamers_count: number;
    gamer_answers_count: number;
    total_correct: number;
    quizze?: {
        id: string;
        title: string;
    };
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    components: {
        RiMore2Fill,
        RiDeleteBin7Fill,
        RiRefreshLine,
        RiEyeCloseFill,
        RiSearchLine,
    },
    setup() {
        const currentPage = ref<number>(1);
        const defalutPerpage = ref<number>(RoomSetting.PER_PAGE);
        const totalRoomReport = ref<number>(0);
        const showModalDelete = ref<boolean>(false);
        const listRoom = ref<Room[]>([]);
        const roomType = RoomType;
        const roomStatus = RoomStatus;
        const currentRoomReportId = ref<string>("");
        const defaultTime = new Date();
        const filterParams = ref({
            type: '',
            code: '',
            code_quiz: '',
            status: '',
            time_report: []
        })

        const getListRoomReport = async () => {
            let paramsFilter = {
                page: currentPage.value,
                type: filterParams.value.type,
                code: filterParams.value.code,
                code_quiz: filterParams.value.code_quiz,
                status: filterParams.value.status,
                start_time: filterParams.value.time_report[0] ? moment(new Date(filterParams.value.time_report[0])).format("YYYY-MM-DD HH:mm:ss") : '',
                end_time: filterParams.value.time_report[1] ? moment(new Date(filterParams.value.time_report[1])).format("YYYY-MM-DD HH:mm:ss") : '',
            };

            await api.room.getListRoomReport(
                paramsFilter,
                (res: any) => {
                    ElLoading.service({ fullscreen: true }).close();
                    listRoom.value = res.data;
                    totalRoomReport.value = res.total;
                },
                (err: ErrorResponse) => {
                    ElLoading.service({ fullscreen: true }).close();
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            )
        }

        const formatDate = (date: string) => {
            return moment(date).format("DD/MM/YYYY HH:mm:ss");
        }

        const getStatusText = (status: number) => {
            return ROOM_STATUS_TEXT[status];
        }

        const showModalDeleteRoomReport = (id: string) => {
            currentRoomReportId.value = id;
            showModalDelete.value = true;
        }

        const deleteRoom = async () => {
            await api.room.deleteRoomReport(
                currentRoomReportId.value,
                (res: any) => {
                    showModalDelete.value = false;
                    ElNotification({title: "Success", message: 'Xóa báo cáo room thành công!', type: "success"});
                    getListRoomReport();
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
                
            )
        }
        

        const resetFilter = async () => {
            filterParams.value = {
                type: '',
                code: '',
                status: '',
                time_report: []
            }

            await getListRoomReport();
        }

        const handleCurrentChangeReport = async (page: number) => {
            currentPage.value = page;
            await getListRoomReport();
        }

        const roomTypesArray = Object.entries(RoomType).filter(([key, value]) => typeof value === 'number');
        const roomStatusArray = Object.entries(RoomStatus).filter(([key, value]) => typeof value === 'number');

        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getListRoomReport();
        });

        return {
            showModalDelete,
            listRoom,
            roomType,
            getStatusText,
            showModalDeleteRoomReport,
            handleCurrentChangeReport,
            totalRoomReport,
            defaultTime,
            roomTypesArray,
            filterParams,
            roomStatus,
            roomStatusArray,
            getListRoomReport,
            formatDate,
            resetFilter,
            deleteRoom,
            defalutPerpage,
        }
    }
})
</script>
<style scoped>
.el-date-editor.el-input, .el-date-editor.el-input__wrapper {
    height: 38px;
}
</style>