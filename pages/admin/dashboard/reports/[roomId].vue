<template>
    <div class="container">
        <el-dialog v-model="showModelStartGame" close-icon="false" :close-on-click-modal="false" title="Warning"
            width="500" align-center>
            <span class="text-center align-center">Bắt đầu bài kiểm tra ngay lập tức?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showModelStartGame = false">Hủy</el-button>
                    <el-button type="primary" @click="startGame">
                        Xác nhận
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="showModelEndGame" close-icon="false" :close-on-click-modal="false" title="Warning"
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
        </el-dialog>
        <!-- show current question -->
        <el-dialog v-model="showModalViewQuestion" :title="(listQuestionRooms.findIndex(item => item.id == currentShowQuestion.id) + 1) + '. ' + currentShowQuestion.title"
            width="500" align-center>
            <div class="col-xl-9 col-lg-9 col-md-8 col-sm-6">
                <div class="form-check" v-for="(answer, index) in currentShowQuestion.answers">
                    <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
                    <label class="form-check-label ms-2" for="flexCheckDefault">
                        {{ answer.answer }}
                    </label>
                </div>
            </div>
        </el-dialog>
         <!-- end show current question -->
        <!-- Header Section -->
        <div class="header" v-if="roomDetail.id">
            <div class="d-flex justify-content-start">
                <h4 class="text-dark">{{ roomDetail.quizze?.title }}</h4>
                <span v-if="roomDetail.type != homeworkType" class="fw-bold fs-4 ms-3 mt-1 text-success">{{
                    roomDetail.code }}</span>
                <span v-if="roomDetail.type != homeworkType" @click="copyCode">
                    <RiFileCopyLine class="ms-3 cursor-pointer" />
                </span>
            </div>
            <!-- <div class="mb-auto">
                <button v-if="roomDetail.status == defaultStatus" class="btn btn-outline-secondary text-dark">Chỉnh sửa
                    câu hỏi</button>
                <button v-if="roomDetail.status == defaultStatus" class="btn btn-outline-secondary text-dark">Chỉnh sửa
                    cài đặt</button>
                <button v-if="roomDetail.status == runningStatus || roomDetail.status == pendingStatus" class="btn btn-danger"
                    @click="showModelEndGame = true">
                    <RiCloseFill size="19" />
                    Kết thúc
                </button>
                <button class="btn btn-danger" v-if="roomDetail.status == defaultStatus">
                    <RiDeleteBin2Fill size="16" class="mb-1"/>
                    Xóa
                </button>
            </div> -->
        </div>
        <!-- Game Info -->
        <div class="main-card">
            <div class="d-flex justify-content-between align-items-center" v-if="roomDetail.id">
                <div class="d-flex">
                    <span>{{ roomDetail.type == homeworkType ? 'Bắt đầu vào:' : 'Được tạo lúc:' }} 
                        <strong>
                            {{ roomDetail.type == homeworkType ? formatDate(roomDetail.started_at) : formatDate(roomDetail.created_at) }}
                        </strong>
                    </span>
                    <span :class="'badge ms-1 ' + getStatusText(roomDetail.status)?.className">{{
                        getStatusText(roomDetail.status)?.text }}
                    </span>
                    <span v-if="roomDetail.status == finishedStatus" class="ms-1 text-danger fw-bold">
                        {{ 'từ ' + formatDate(roomDetail.ended_at) }}
                    </span>
                </div>
                <button v-if="roomDetail.status == defaultStatus" class="btn btn-primary" @click="handleStartGame">Bắt
                    đầu ngay</button>
            </div>
        </div>
        <!-- Invite Section -->
        <div v-if="roomDetail.type == homeworkType && (roomDetail.status == defaultStatus || roomDetail.status == runningStatus)"
            class="purple-card bg-primary mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex justify-content-start">
                        <h5 class="text-white">Mời người tham gia</h5>
                        <span class="fw-bold fs-4 ms-3 text-success">{{ roomDetail.code }}</span>
                        <span @click="copyCode">
                            <RiFileCopyLine class="ms-3 cursor-pointer" />
                        </span>
                    </div>
                    <span class="fs-6">
                        <RiTimeLine size="15" /> Hạn chót: <span class="text-success fw-bold">{{
                            formatDate(roomDetail.ended_at) }}</span>
                    </span>
                </div>
                <div class="d-flex flex-column text-end">
                    <button class="btn btn-outline-light">
                        <RiEditFill size="18" class="mb-1" />
                        Chỉnh sửa
                    </button>
                </div>
            </div>
        </div>
        <!-- Progress Section -->
        <div class="main-card">
            <div class="d-flex justify-content-between align-items-center">
                <span>
                    <span class="badge bg-success">{{ roomDetail.type == homeworkType ? "Bài về nhà" : "Kahoot"
                        }}</span><span class="ms-2" @click="getRoomDetail()">
                        <RiRefreshLine size="15" class="text-primary cursor-pointer" />
                    </span>
                </span>
                <span class="m-0 text-muted">
                    <RiTimeLine size="15" /> Cập nhật mới nhất: {{ getLatestActivity() }}
                </span>
            </div>
            <div class="row mt-3">
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-answer-correct">
                                    <RiRegisteredLine />
                                </span>
                            </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> {{ getPercentAnswerCorrectOfRoom() + '%' }} </h2><span>Câu đúng</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-num-submit">
                                    <RiCheckboxCircleLine />
                                </span>
                            </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> {{ getPercentQuestionReplied() + '%' }} </h2><span>Tỷ lệ hoàn thành</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-num-user">
                                    <RiUser2Line />
                                </span>
                            </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> {{ listGamers.length }} </h2><span>Số người
                                    chơi</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <span class="b-avatar mb-1 badge-light-info">
                                <span class="b-avatar-custom p-2 rounded-circle icon-question">
                                    <RiQuestionLine />
                                </span>
                            </span>
                            <div class="truncate mt-2">
                                <h2 class="mb-25 font-weight-bolder"> {{ listQuestionRooms.length }} </h2><span>Số câu
                                    hỏi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 d-flex" v-if="roomDetail.id">
                <button @click="navigateTo('/admin/dashboard/activity/' + roomDetail.id)" class="btn btn-primary me-2 text-white" v-if="roomDetail.type != homeworkType && roomDetail.status != finishedStatus && roomDetail.status != cancelStatus">
                    <RiQuestionLine size="19" />
                    Bảng điều kiển
                </button>
                <button v-if="roomDetail.quizze != null" @click="navigateTo('/admin/dashboard/my-library/' + roomDetail.quizze?.id)" class="btn btn-outline-secondary me-2 text-dark">
                    <RiQuestionLine size="19" />
                    Xem Quizz
                </button>
            </div>
        </div>
        <!-- Players Section -->
        <div class="players-card main-card">
            <el-tabs v-model="activeName" class="demo-tabs review-tabs" @tab-click="handleClick">
                <el-tab-pane label="Người chơi" name="first">
                    <div class="empty-section" v-if="listGamers.length == 0">
                        <p>Chưa có người tham gia nào tham gia.</p>
                    </div>
                    <table class="table" v-if="listGamers.length > 0">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">#</th>
                                <th scope="col" class="fs-6 text-dark">Tên</th>
                                <th scope="col" class="fs-6 text-dark">Điểm</th>
                                <th scope="col" class="fs-6 text-dark">Câu đúng</th>
                                <th scope="col" class="fs-6 text-dark" v-if="roomDetail.type == homeworkType">Trạng thái</th>
                                <th scope="col" class="fs-6 text-dark">Tham gia vào</th>
                                <th scope="col" class="fs-6 text-dark text-center">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in listGamers" :key="index">
                                <th scope="row" class="text-dark">{{ index + 1 }}</th>
                                <td class="text-dark">{{ item.name ?? 'Sóc ẩn danh' }}</td>
                                <td class="text-dark">{{ roomDetail.type == homeworkType ? ((item.gamer_answers_sum_score ?? 0) + '/' + listQuestionRooms.length) : (item.gamer_answers_sum_score ?? 0) }}</td>
                                <td class="text-dark">{{ countQuestionTrue(item) }}</td>
                                <td v-if="roomDetail.type == homeworkType">
                                    <div :class='"badge text-white " + getUserStatusExam(item).class'>
                                        <div>{{ getUserStatusExam(item).status }}</div>
                                        <div v-if="roomDetail.status == runningStatus && item.gamer_token?.submit_at">{{ getUserStatusExam(item).time }}</div>
                                    </div>
                                </td>
                                <td>{{ formatDate(item.gamer_token?.created_at) }}</td>
                                <td class="text-dark text-center">
                                    <span :class="'badge cursor-pointer width-2 ms-1 ' + getResultQustionColor(item.gamer_answers, question.id).class" v-for="(question, key) in listQuestionRooms" :key="key" @click="handleShowModalQuestion(question)">
                                        <p class="mb-1 mt-1">{{ 'Q' + (key + 1) + (getResultQustionColor(item.gamer_answers, question.id).index > -1 ? ':' + defaultStringSort[getResultQustionColor(item.gamer_answers, question.id).index] : '') }}</p>
                                        <p class="mb-1 mt-1" v-if="roomDetail.type != homeworkType">{{ getResultQustionColor(item.gamer_answers, question.id).score }}</p>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="Câu hỏi" name="second">
                    <div class="row pt-2 rounded rounded-5 body-answer-review-report">
                        <div class="col-lg-12 px-4 mb-2">
                            <div v-for="(item, index) in listQuestionRooms"
                                class="question-preview-content border rounded rounded-3 pl-2 mb-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="col-md-12 d-flex justify-content-start mt-2">
                                        <span class="text-black fw-normal fs-5 pt-2 px-4 text-start font-bold">
                                            {{ (index + 1) + ". " + item.title }}
                                            <span class="fw-bold">
                                                {{ roomDetail.type == homeworkType ? "1 điểm" : '1000 điểm' }}
                                            </span>
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
                                    <div class="col-xl-3 col-lg-9 col-md-4 col-sm-6">
                                        <div class="form-check">
                                            <label class="form-check-label ms-2" for="flexCheckDefault">
                                                Câu đúng:
                                            </label>
                                            <span class="text-success">
                                                {{ ' ' + getCountAnswerCorrectOfQuestion(item.id) }}<RiUser2Fill size="15" class="mb-1" />
                                            </span>
                                        </div>
                                        <div class="form-check">
                                            <label class="form-check-label ms-2" for="flexCheckDefault">
                                                Câu sai:
                                            </label>
                                            <span :class="getCountAnswerFailOfQuestion(item.id) > 0 ? 'text-danger' : 'text-success'">
                                                {{ ' ' + getCountAnswerFailOfQuestion(item.id) }}<RiUser2Fill size="15" class="mb-1" />
                                            </span>
                                        </div>
                                        <div class="form-check">
                                            <label class="form-check-label ms-2" for="flexCheckDefault">
                                                Chưa trả lời:
                                            </label>
                                            <span class="text-warning">
                                                {{' ' + getCountNonAnswerOfQuestion(item.id) }} <RiUser2Fill size="15" class="mb-1" />
                                            </span>
                                        </div>
                                        <div class="form-check" v-if="roomDetail.type != homeworkType">
                                            <label class="form-check-label ms-2" for="flexCheckDefault">
                                                Thời gian trung bình:
                                            </label>
                                            <span class="text-dark">
                                                {{ ' ' + timeAverageReplyQuestion(item.id) }} ms
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { Answer, ErrorResponse, GamerAnswer, GamerToken, ItemQuestion, Quizz } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { RiDeleteBin2Fill, RiCloseFill, RiUser2Fill, RiEditFill, RiCheckFill, RiMore2Fill, RiDeleteBin7Fill, RiRegisteredLine, RiCheckboxCircleLine, RiUser2Line, RiQuestionLine, RiTimeLine, RiRefreshLine, RiFileCopyLine } from "@remixicon/vue";
import moment from "moment";
import { useRoute } from "vue-router";
import { RoomSetting, RoomStatus, RoomType } from "~/constants/room";
import { ROOM_STATUS_TEXT } from "~/constants/room";
import type { TabsPaneContext } from 'element-plus'
import helperApp from "~/utils/helper";

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

interface RoomDetail {
    id: string;
    code: string;
    started_at: string;
    ended_at: string;
    status: RoomStatus;
    type: RoomType;
    quizze: Quizz;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    components: {
        RiMore2Fill,
        RiDeleteBin7Fill,
        RiRegisteredLine,
        RiCheckboxCircleLine,
        RiUser2Line,
        RiQuestionLine,
        RiTimeLine,
        RiRefreshLine,
        RiFileCopyLine,
        RiCheckFill,
        RiEditFill,
        RiUser2Fill,
        RiCloseFill,
        RiDeleteBin2Fill,
    },
    setup() {
        const route = useRoute();
        const showModelStartGame = ref<boolean>(false);
        const showModelEndGame = ref<boolean>(false);
        const listQuestionRooms = ref<ItemQuestion[]>([]);
        const listGamers = ref<Array<GamerInfo>>([]);
        const defaultStringSort = ref<string>('ABCDEFGH');
        const roomDetail = ref<RoomDetail>({
            id: '',
            code: '',
            started_at: '',
            ended_at: '',
            status: 0,
            type: 0,
            quizze: {
                id: '',
                title: '',
                category_id: 0,
                created_at: '',
                updated_at: ''
            },
            created_at: '',
            updated_at: ''
        });
        const showModalViewQuestion = ref<boolean>(false);
        const currentShowQuestion = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: '',
        })
        const defaultStatus = ref<number>(RoomStatus.PREPARE);
        const runningStatus = ref<number>(RoomStatus.HAPPING);
        const finishedStatus = ref<number>(RoomStatus.FINISHED);
        const pendingStatus = ref<number>(RoomStatus.PENDING);
        const cancelStatus = ref<number>(RoomStatus.CANCEL);
        const homeworkType = ref<number>(RoomType.HOMEWORK);
        const activeName = ref('first');

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const getRoomDetail = async () => {
            await api.room.getDetailRoom(
                route.params.roomId as string,
                (res: any) => {
                    roomDetail.value = res.room;
                    listQuestionRooms.value = res.questions;
                    listGamers.value = res.gamers;
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error",message: err.error.shift(),type: "error"});
                }
            )

            ElLoading.service({ fullscreen: true }).close();
        }

        const handleStartGame = () => {
            showModelStartGame.value = true;
        }

        const startGame = async () => {
            ElLoading.service({ fullscreen: true });
            await api.room.startGame(
                route.params.roomId.toString(),
                (res: any) => {
                    ElNotification({title: "Success", message: "Bài kiểm tra đang diễn ra!", type: "success"});
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Warning", message: err.error.shift(), type: "warning"});
                }
            )
            showModelStartGame.value = false;
            ElLoading.service({ fullscreen: true }).close();
        }

        const endGame = async () => {
            await api.room.adminEndGame(
                route.params.roomId.toString(),
                (res: any) => {
                    ElNotification({title: "Success", message: "Bài kiểm tra đã kết thúc!", type: "success"});
                    getRoomDetail();
                },
                (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                }
            );
            showModelEndGame.value = false;
        }

        const getCountAnswerCorrectOfQuestion = (questionId: string) => {
            if (listGamers.value.length > 0) {
                return listGamers.value.filter((item: any) => item.gamer_answers.some((answer: any) => answer.question_id == questionId && answer.score > 0)).length
            }

            return 0;
        }

        const getCountAnswerFailOfQuestion = (questionId: string) => {
            if (listGamers.value.length > 0) {
                return listGamers.value.filter((item: any) => item.gamer_answers.some((answer: any) => answer.question_id == questionId && answer.score == 0)).length
            }

            return 0;
        }

        const getCountNonAnswerOfQuestion = (questionId: string) => {
            if (listGamers.value.length > 0) {
                return listGamers.value.filter((item: any) => !item.gamer_answers.some((answer: any) => answer.question_id == questionId)).length
            }

            return 0;
        }

        const timeAverageReplyQuestion = (questionId: string) => {
            const totalTime = listGamers.value.reduce((total, gamer) => {
                const answer = gamer.gamer_answers.find((answer: GamerAnswer) => answer.question_id === questionId);
                return answer ? total + answer.answer_in_time : total;
            }, 0);

            const countAnswerSubmit = getCountAnswerFailOfQuestion(questionId) + getCountAnswerCorrectOfQuestion(questionId);

            return countAnswerSubmit > 0 ?
                Math.round((RoomSetting.TIME_REPLY * 1000 * countAnswerSubmit - totalTime) / countAnswerSubmit) : 0;
        }

        const countQuestionTrue = (item: GamerInfo) => {
            return item.gamer_answers.length > 0 ? item.gamer_answers.filter((answer: GamerAnswer) => answer.score > 0).length : 0;
        }

        const getPercentAnswerCorrectOfRoom = () => {
            let totalQuestionCorrect = 0;
            let totalQuestionReplied = 0;
            if (listGamers.value.length > 0) {
                listGamers.value.forEach((item: GamerInfo) => {
                    totalQuestionCorrect += countQuestionTrue(item);
                    totalQuestionReplied += item.gamer_answers.length;
                })
            }

            return totalQuestionReplied > 0 ? Math.round(totalQuestionCorrect * 100 / totalQuestionReplied) : 0;
        }

        const getPercentQuestionReplied = () => {
            let totalQuestionReplied = 0;
            if (listGamers.value.length > 0) {
                listGamers.value.forEach((item: GamerInfo) => {
                    totalQuestionReplied += item.gamer_answers.length;
                })
            }

            return listGamers.value.length > 0 ? Math.round(totalQuestionReplied * 100 / (listGamers.value.length * listQuestionRooms.value.length)) : 0;
        }

        const getLatestActivity = () => {
            const roomDetailUpdatedAt = roomDetail.value.updated_at;
            let maxDate = roomDetailUpdatedAt;
            const gamerTokens = listGamers.value.map((item: any) => item.gamer_token);
            let gamerAnswersRoom: GamerAnswer[] = [];
            for (const item of listGamers.value) {
                for (const answer of item.gamer_answers) {
                    gamerAnswersRoom.push(answer);
                }
            }
            
            const latestSubmitAt = gamerTokens.length > 0 ? gamerTokens.filter(item => item.submited_at !== null)
                .reduce((max, item) => {
                    return new Date(item.submited_at) > new Date(max.submited_at) ? item : max;
                }) : null;
                
            const latestAnswerAt = gamerAnswersRoom.length > 0 ? gamerAnswersRoom.reduce((max, item) => {
                return new Date(item.created_at) > new Date(max.created_at) ? item : max;
            }) : null;

            if (latestSubmitAt?.submited_at && moment(latestSubmitAt?.submited_at) > moment(maxDate)) {
                maxDate = latestSubmitAt?.submited_at;
            }
            
            if (latestAnswerAt?.created_at && moment(latestAnswerAt?.created_at) > moment(maxDate)) {
                maxDate = latestAnswerAt?.created_at;
            }

            return helperApp.calculateTimeAgo(maxDate);
        }

        const getUserStatusExam = (item: GamerInfo) => {
            if (item.gamer_token?.submit_at) {
                return {
                    time: moment(item.gamer_token?.submit_at).format("DD/MM/YYYY HH:mm:ss"),
                    class: "bg-success",
                    status: "Đã nộp bài"
                }
            }

            if (roomDetail.value.status == RoomStatus.FINISHED) {
                return {
                    time: moment(roomDetail.value.ended_at).format("DD/MM/YYYY HH:mm:ss"),
                    class: "bg-danger",
                    status: "Đã kết thúc"
                }
            }

            if (roomDetail.value.status == RoomStatus.PREPARE) {
                return {
                    time: moment(roomDetail.value.started_at).format("DD/MM/YYYY HH:mm:ss"),
                    class: "bg-warning",
                    status: "Chưa bắt đầu"
                }
            }

            return {
                time: moment(item.gamer_token?.created_at).format("DD/MM/YYYY HH:mm:ss"),
                class: "bg-warning",
                status: "Chưa nộp bài"
            }
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
                let answersOfQuestion = listQuestionRooms.value.find((item: ItemQuestion) => item.id == questionId)?.answers;
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

        const handleShowModalQuestion = (question: ItemQuestion) => {
            showModalViewQuestion.value = true;
            currentShowQuestion.value = question;
        }
        
        onMounted(async () => {
            ElLoading.service({ fullscreen: true });
            await getRoomDetail();
        });

        const copyCode = () => {
            const textArea = document.createElement("textarea");
            textArea.value = roomDetail.value.code.toString();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            ElNotification({title: "Success", message: "Sao chép mã code thành công!", type: "success"});
        };

        const formatDate = (date: string) => {
            return moment(date).format("DD/MM/YYYY HH:mm:ss");
        }

        const getStatusText = (status: number) => {
            return ROOM_STATUS_TEXT[status];
        }

        return {
            roomDetail,
            showModelStartGame,
            startGame,
            handleStartGame,
            endGame,
            showModelEndGame,
            copyCode,
            getRoomDetail,
            formatDate,
            defaultStatus,
            runningStatus,
            homeworkType,
            getStatusText,
            listQuestionRooms,
            activeName,
            handleClick,
            listGamers,
            getCountAnswerCorrectOfQuestion,
            getCountAnswerFailOfQuestion,
            getCountNonAnswerOfQuestion,
            timeAverageReplyQuestion,
            countQuestionTrue,
            getResultQustionColor,
            getPercentAnswerCorrectOfRoom,
            getUserStatusExam,
            getPercentQuestionReplied,
            getLatestActivity,
            finishedStatus,
            pendingStatus,
            cancelStatus,
            defaultStringSort,
            handleShowModalQuestion,
            showModalViewQuestion,
            currentShowQuestion,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/admin/admin-report-detail.scss';
</style>