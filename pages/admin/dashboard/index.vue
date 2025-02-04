<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="row">
      <!-- View sales -->
      <div class="col-xl-4 mb-4 col-lg-5 col-12">
        <div class="card">
          <div class="d-flex align-items-end row">
            <div class="col-7">
              <div class="card-body text-nowrap">
                <h5 class="card-title mb-0">Thành viên mới! 🎉</h5>
                <p class="mb-2">Tham gia vào {{ formatDate(latestCustomer.created_at.toString()) }}</p>
                <h4 class="text-primary mb-1 fs-5">{{ latestCustomer.name }}</h4>
                <nuxt-link :to="`/admin/account/${latestCustomer.id}`" class="btn btn-primary mt-3">Xem Profile</nuxt-link>
              </div>
            </div>
            <div class="col-5 text-center text-sm-left">
              <div class="card-body pb-0 px-0 px-md-4 pb-4">
                <img class="img-fluid-new-user"
                  :src="latestCustomer.avatar ? latestCustomer.avatar : '/img/avatars/1.png'"
                  height="100"
                  alt="view sales" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- View sales -->
      <!-- Statistics -->
      <div class="col-xl-8 mb-4 col-lg-7 col-12">
        <div class="card h-100">
          <div class="card-header">
            <div class="d-flex justify-content-between mb-3">
              <h5 class="card-title mb-0">Tổng Quan</h5>
              <span @click="refreshDashboard" class="ms-1"><RiRefreshLine size="20" class="text-danger cursor-pointer" /></span>
            </div>
          </div>
          <div class="card-body">
            <div class="row gy-3">
              <div class="col-md-3 col-6">
                <div class="d-flex align-items-center">
                  <div class="badge rounded-pill bg-label-info me-3 p-2">
                    <i class="ti ti-users ti-sm"></i>
                  </div>
                  <div class="card-info">
                    <h5 class="mb-0">{{ overview.count_customer }}</h5>
                    <small>Người dùng</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="d-flex align-items-center">
                  <div class="badge rounded-pill bg-label-danger me-3 p-2">
                    <i class="ti ti-question-mark ti-sm"></i>
                  </div>
                  <div class="card-info">
                    <h5 class="mb-0">{{ overview.count_question }}</h5>
                    <small>Câu hỏi</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="d-flex align-items-center">
                  <div class="badge rounded-pill bg-label-primary me-3 p-2">
                    <i class="ti ti-access-point ti-sm"></i>
                  </div>
                  <div class="card-info">
                    <h5 class="mb-0">{{ overview.count_room }}</h5>
                    <small>Room</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="d-flex align-items-center">
                  <div class="badge rounded-pill bg-label-success me-3 p-2">
                    <i class="ti ti-device-gamepad-2 ti-sm"></i>
                  </div>
                  <div class="card-info">
                    <h5 class="mb-0">{{ overview.count_gamer }}</h5>
                    <small>Người chơi</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--/ Statistics -->

      <div class="col-xl-4 col-12">
        <div class="row">
          <!-- Expenses -->
          <div class="col-xl-6 mb-4 col-md-3 col-6">
            <div class="card">
              <div class="card-header pb-0">
                <h5 class="card-title mb-0">{{ answerChart.total }}</h5>
                <small class="text-muted">Câu trả lời</small>
              </div>
              <div class="card-body d-flex justify-content-center row">
                <div class="row text-center">
                    <el-progress class="d-flex justify-content-center" type="circle" color="orange" :percentage="answerChart.percent_up" />
                </div>
                <div class="mt-md-2 text-center mt-lg-3 mt-3 row">
                  <small class="text-muted mt-3">Có đến <span class="text-success">{{ answerChart.percent_up }}%</span> người chơi đưa ra trả lời chính xác</small>
                </div>
              </div>
            </div>
          </div>
          <!--/ Expenses -->

          <!-- Profit last month -->
          <div class="col-xl-6 mb-4 col-md-3 col-6">
            <div class="card">
              <div class="card-header pb-0">
                <h5 class="card-title mb-0">Bộ câu hỏi</h5>
                <small class="text-muted">Last Month</small>
              </div>
              <div class="card-body pb-3">
                <Doughnut :data="chartQuestionData" />
                <div class="d-flex justify-content-between align-items-center mt-3 gap-3">
                  <h4 class="mb-0">{{ quizChart.total }}</h4>
                  <small :class="quizChart.total > quizChart.previous_month ? 'text-success' : 'text-danger'">{{ quizChart.percent_up }}%</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-12 mb-4 col-md-6">
            <div class="card pb-0">
              <div class="card-body pb-0">
                <div class="d-flex justify-content-between">
                  <div class="col-xl-6 mb-4 col-md-6">
                    <div class="card-title mb-auto">
                      <h5 class="mb-1 text-nowrap">Lượt chia sẻ</h5>
                      <small>Monthly Report</small>
                    </div>
                    <div class="chart-statistics">
                      <h3 class="card-title mb-1">{{ shareQuizChart.total }}</h3>
                      <small class="text-nowrap fw-semibold" :class="shareQuizChart.total > shareQuizChart.previous_month ? 'text-success' : 'text-danger'"
                        ><i class="ti ti-chevron-up me-1"></i> {{ shareQuizChart.percent_up }}%</small
                      >
                    </div>
                  </div>
                  <div class="col-xl-6 mb-4 col-md-6">
                    <Doughnut style="height: 85%; width: 85%;" :data="chartShareQuizData"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--/ Profit last month -->
        </div>
      </div>
      <!-- Revenue Report -->
      <div class="col-12 col-xl-8 mb-4 col-lg-7">
        <div class="card p-4">
            <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <div class="card-title mb-auto">
                    <h5 class="mb-1 text-nowrap">Báo cáo room</h5>
                    <small>Báo cáo năm</small>
                  </div>
                </div>
                <el-select @change="changeRoomYearChart"
                  v-model="currentRoomYearChart"
                  placeholder="Select"
                  size="small"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in currentGamerYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div class="chart-statistics d-flex">
                  <h3 class="card-title mb-1">{{ roomChart.sum_room_current_year }}</h3>
                  <small class="text-nowrap fw-semibold" :class="roomChart.sum_room_current_year > roomChart.previous_year ? 'text-success' : 'text-danger'"
                    ><i class="ti me-1" :class="roomChart.sum_room_current_year > roomChart.previous_year ? 'ti-chevron-up' : 'ti-chevron-down'"></i> {{ roomChart.percent_up }}%</small
                  >
                </div>
              </div>
              <canvas style="min-height: 400px" ref="chartRoomRef"></canvas>
        </div>
      </div>
      <!-- Generated Leads -->
      <!-- Transactions -->
      <div class="col-md-6 col-lg-4 mb-lg-0">
        <div class="card pb-0">
          <div class="card-header d-flex justify-content-between">
            <div class="card-title m-0 me-2">
              <h5 class="m-0 me-2">Top chủ đề</h5>
              <small class="text-muted">10 chủ đề phổ biến trong năm</small>
            </div>
            <div class="dropdown">
              <button
                class="btn p-0"
                type="button"
                id="transactionID"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <i class="ti ti-dots-vertical ti-sm text-muted"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                <a class="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                <a class="dropdown-item" href="javascript:void(0);">Last Month</a>
                <a class="dropdown-item" href="javascript:void(0);">Last Year</a>
              </div>
            </div>
          </div>
          <div class="card-body pb-0">
            <ul class="p-0 m-0">
              <li class="d-flex mb-1 pb-1 align-items-center" v-for="(item, index) in categories" :key="index">
                <div class="badge me-3 rounded p-2" :style="{ backgroundColor: item.bg_icon }">
                  <i class="ti ti-sm" :class="item.icon"></i>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <h6 class="mb-0">{{ item.name }}</h6>
                  </div>
                  <div class="user-progress d-flex align-items-center gap-1">
                    <h6 class="mb-0 text-primary">{{ item.quizzes_count + 'Q' }}</h6>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--/ Transactions -->
      <div class="col-12 col-xl-8 mb-4 col-lg-7">
        <div class="card p-4">
            <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <div class="card-title mb-auto">
                    <h5 class="mb-1 text-nowrap">Người chơi tham gia</h5>
                    <small>Báo cáo năm</small>
                  </div>
                </div>
                <el-select @change="changeGamerYearChart"
                  v-model="currentGamerYearChart"
                  placeholder="Select"
                  size="small"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in currentGamerYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div class="chart-statistics d-flex">
                  <h3 class="card-title mb-1">{{ gamerChart.sum_gamer_current_year }}</h3>
                  <small class="text-nowrap fw-semibold" :class="gamerChart.sum_gamer_current_year > gamerChart.previous_year ? 'text-success' : 'text-danger'"
                    ><i class="ti me-1" :class="gamerChart.sum_gamer_current_year > gamerChart.previous_year ? 'ti-chevron-up' : 'ti-chevron-down'"></i> {{ gamerChart.percent_up }}%</small
                  >
                </div>
              </div>
              <canvas style="min-height: 400px" ref="chartGamerRef"></canvas>
        </div>
      </div>
      <!--/ Generated Leads -->
      <!--/ Revenue Report -->
      <!-- Invoice table -->
      <div class="col-lg-12">
        <div class="card h-100">
          <div class="row ms-2 me-3 d-flex justify-content-between">
            <div class="col-xl-3 col-lg-6 col-md-4 col-sm-6">
              <label class="pt-2 text-primary">Room đang diễn ra</label>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-4 col-sm-6 pb-2">
              <nuxt-link class="btn btn-secondary btn-primary float-end" to="/admin/dashboard/reports">
                <span><i class="ti ti-plus"></i><span class="d-md-inline-block mt-1 d-none">Xem thêm</span></span>
              </nuxt-link>
            </div>
          </div>
          <div class="table-responsive card-datatable">
            <table class="table datatable-invoice border-top" v-if="listRoom.length > 0">
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
              </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listRoom" :key="index" class="cursor-pointer" @click="navigateTo(`/admin/dashboard/reports/${item.id}`)">
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
                      <span>
                        <el-progress stroke-width="4" width="30" type="circle"
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
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- /Invoice table -->
    </div>
  </div>
</template>
<script lang="ts">
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, registerables } from 'chart.js'
import api from '~/api/axios';
import type { ErrorResponse, UserProfile } from '~/constants/type';
import moment from "moment";
import { ElLoading, ElNotification } from "element-plus";
import { ROOM_STATUS_TEXT, RoomStatus, RoomType } from "~/constants/room";
import { RiRefreshLine } from "@remixicon/vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, ...registerables)

definePageMeta({
  layout: "admin-dashboard",
});

interface ItemCategory {
  id: number;
  name: string;
  icon: string;
  color_icon: string;
  bg_icon: string;
  quizzes_count: number;
};

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
  name: "Dashboard",
  components: {
    Bar,
    Line,
    Doughnut,
    RiRefreshLine,
  },
  setup() {
      const chartRoomData = ref({
        labels: Array<string>(),
        datasets: Array<any>(),
      });
      const chartRoomOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      });
      const chartRoomLineOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      });
      const chartQuestionData = ref({
        labels: Array<string>(),
        datasets: Array<any>(),
      });
      const chartGamerData = ref({
        labels: Array<string>(),
        datasets: Array<any>(),
      });
      const chartGamerOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      });

      const chartShareQuizData = ref({
        labels: Array<string>(),
        datasets: Array<any>(),
      });

      const categories = ref<Array<ItemCategory>>([]);
      const latestCustomer = ref<UserProfile>({
        id: "",
        name: "",
        email: "",
        email_verified_at: null,
        avatar: "",
        type: 0,
        latest_login: new Date(),
        latest_ip_login: "",
        disabled: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const overview = ref({
        count_customer: 0,
        count_question: 0,
        count_room: 0,
        count_gamer: 0
      });

      const gamerChart = ref({
        gamer_group_by_year: Array<any>(),
        gamer_chart_label: Array<string>(),
        sum_gamer_current_year: 0,
        previous_year: 0,
        percent_up: 0,
      });

      const roomChart = ref({
        room_group_by_year: Array<any>(),
        room_chart_label: Array<string>(),
        sum_room_current_year: 0,
        previous_year: 0,
        percent_up: 0,
      });

      const answerChart = ref({
        total: 0,
        correct: 0,
        percent_up: 0,
      });

      const quizChart = ref({
        total: 0,
        total_by_user: 0,
        previous_month: 0,
        percent_up: 0,
      });

      const shareQuizChart = ref({
        total: 0,
        previous_month: 0,
        percent_up: 0,
      });

      const chartGamerRef = ref(null);
      let myGamerChart: any = null;
      
      const chartRoomRef = ref(null);
      let myRoomChart: any = null;
      const currentRoomYearChart = ref<number>(new Date().getFullYear());

      const chartRoomLineRef = ref(null);
      let myRoomLineChart: any = null;

      const currentGamerYearChart = ref<number>(new Date().getFullYear());
      const currentGamerYearOptions = ref<Array<any>>([]);

      const listRoom = ref<Room[]>([]);
      const roomType = RoomType;

      const loadingData = async () => {
        ElLoading.service({ fullscreen: true });
        await api.dashboard.index(
          {year_of_gamer_chart: currentGamerYearChart.value, year_of_room_chart: currentRoomYearChart.value},
          (res : any) => {
            categories.value = res.categories;
            latestCustomer.value = res.latest_customer;
            overview.value = res.overview;
            gamerChart.value = res.gamer_chart;
            roomChart.value = res.room_chart;
            answerChart.value = res.answers;
            quizChart.value = res.quiz;
            shareQuizChart.value = res.share_quiz;
          },
          (err: ErrorResponse) => {
            ElNotification({title: "Error", message: err.error.shift(), type: "error"});
          }
        );

        ElLoading.service({ fullscreen: true }).close();
      }

      const getListRoomReport = async () =>  {
        await api.room.getListRoomReport(
          { status: 1 }, // Đang diễn ra
          (res: any) => {
            listRoom.value = res.data;
          },
          (err: ErrorResponse) => {
            ElNotification({title: "Error", message: err.error.shift(), type: "error"});
          }
        )
      }
      
      const getDashboard = async () => {
        await loadingData();
        displayQuestionChart();
        displayShareQuizChart();
        displayRoomChart();
        displayGamerChart();
        await getListRoomReport();
      }

      const displayRoomChart = () => {
        if (chartRoomRef.value) {
          const ctx = chartRoomRef.value.getContext('2d');
          if (myRoomChart) {
            myRoomChart.destroy();
          }

          myRoomChart = new ChartJS(ctx, {
            type: 'bar',
            data: {
              labels: roomChart.value.room_chart_label,
              datasets: [{
                data: roomChart.value.room_group_by_year,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                ],
                borderWidth: 3,
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  min: 0,
                },
              },
            }
          });
        }
      }

      const displayQuestionChart = () => {
          chartQuestionData.value = {
              labels: ['Tạo bởi người dùng', 'Tạo bởi hệ thống'],
              datasets: [
                {
                  label: 'Lượt tạo Quiz',
                  data: [quizChart.value.total_by_user, quizChart.value.total - quizChart.value.total_by_user],
                  backgroundColor: ['rgba(40, 199, 111, 0.16)', 'rgb(40, 199, 111)'],
                  hoverBackgroundColor: ['rgba(40, 199, 111, 0.16)', 'rgb(40, 199, 111)'],
                  borderWidth: 2
                }
              ]
          };
      }

      const displayShareQuizChart = () => {
        chartShareQuizData.value = {
          labels: ['Tháng hiện tại', 'Tháng trước'],
          datasets: [
            {
              label: 'Lượt chia sẻ',
              data: [shareQuizChart.value.total, shareQuizChart.value.previous_month],
              backgroundColor: ['#7367f0', 'rgba(40, 199, 111, 0.16)'],
              hoverBackgroundColor: ['#7367f0', 'rgba(40, 199, 111, 0.16)'],
              borderWidth: 0
            }
          ]
        };
      }

      const displayGamerChart = () => {
        if (chartGamerRef.value) {
          const ctx = chartGamerRef.value.getContext('2d');
          if (myGamerChart) {
            myGamerChart.destroy();
          }

          myGamerChart = new ChartJS(ctx, {
            type: 'line',
            data: {
              labels: gamerChart.value.gamer_chart_label,
              datasets: [{
                data: gamerChart.value.gamer_group_by_year,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 3,
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  min: 0,
                },
              },
            }
          });
        }
      }

      const getStatusText = (status: number) => {
        return ROOM_STATUS_TEXT[status];
      }

      const formatDate = (date: string) => {
        return moment(date).format("DD/MM/YYYY HH:mm:ss");
      };

      const getCurrentGamerYearOption = () => {
        let currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear; year++) {
          currentGamerYearOptions.value.push({
            value: year,
            label: year.toString(),
          });
        }
      }

      const resetGamerChart = () => {
        if (myGamerChart) {
          myGamerChart.destroy();
          myGamerChart = null;
        }
      }

      const resetRoomChart = () => {
        if (myRoomChart) {
          myRoomChart.destroy();
          myRoomChart = null;
        }
        if (myRoomLineChart) {
          myRoomLineChart.destroy();
          myRoomLineChart = null;
        }
      }

      const changeGamerYearChart = async () => {
        await loadingData();
        resetGamerChart();
        displayGamerChart();
        myGamerChart.resize();
      }

      const changeRoomYearChart = async () => {
        await loadingData();
        resetRoomChart();
        displayRoomChart();
        myRoomChart.resize();
        myRoomLineChart.resize();
      }

      const refreshDashboard = async () => {
        currentRoomYearChart.value = new Date().getFullYear();
        currentGamerYearChart.value = new Date().getFullYear();

        await loadingData();
        displayQuestionChart();
        displayShareQuizChart();
        displayRoomChart();
        displayGamerChart();

        resetGamerChart();
        displayGamerChart();
        myGamerChart.resize();

        resetRoomChart();
        displayRoomChart();
        myRoomChart.resize();
        myRoomLineChart.resize();

        await getListRoomReport();
      }

      onMounted(async () => {
        await getDashboard();
        getCurrentGamerYearOption();
      });

      onBeforeUnmount(() => {
        resetGamerChart();
      });

      return {
        chartRoomData,
        chartRoomOptions,
        chartRoomLineOptions,
        chartQuestionData,
        chartGamerData,
        chartGamerOptions,
        categories,
        latestCustomer,
        overview,
        formatDate,
        myGamerChart,
        chartGamerRef,
        gamerChart,
        currentGamerYearChart,
        currentGamerYearOptions,
        changeGamerYearChart,
        roomChart,
        chartRoomRef,
        currentRoomYearChart,
        chartRoomLineRef,
        myRoomLineChart,
        changeRoomYearChart,
        answerChart,
        quizChart,
        chartShareQuizData,
        shareQuizChart,
        listRoom,
        getStatusText,
        refreshDashboard,
        roomType,
      };
    },
});
</script>
<style scoped>
.demo-progress .el-progress--circle {
  margin-right: 15px;
}

.img-fluid-new-user {
  max-width: 100px;
}
</style>
