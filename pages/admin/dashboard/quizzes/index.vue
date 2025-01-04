<template>
  <div class="row ms-4 me-4">
    <div class="app-email card h-100-vh">
      <div class="row g-0 h-100-vh">
        <el-dialog
          v-model="showModalDelete"
          :show-close="false"
          title="Warning"
          width="500"
          align-center
        >
          <span>Bạn có chắc chắn muốn xóa bộ câu hỏi này?</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showModalDelete = false">Hủy</el-button>
              <el-button type="primary" @click="deleteQuizz"> Xác nhận </el-button>
            </div>
          </template>
        </el-dialog>
        <!-- show modal warning room is running -->
        <el-dialog
          v-model="showModalWarningRoomRunning"
          :show-close="false"
          title="Warning"
          width="500"
          align-center
        >
          <span>{{ messageWarningRoomRunning }}</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="danger" @click="showModalWarningRoomRunning = false"
                >Đóng</el-button
              >
            </div>
          </template>
        </el-dialog>
        <!-- end show modal warning room is running  -->
        <!-- Show modal share quizz-->
        <el-dialog
          v-model="showModalShare"
          :show-close="false"
          title="Chia sẻ bộ câu hỏi"
          width="500"
          align-center
        >
          <span>{{ messageWarningRoomRunning }}</span>
          <div v-if="validateMessageEmailBeforeShare.length > 0">
            <div
              class="error-validate text-danger"
              v-for="(error, index) in validateMessageEmailBeforeShare"
              :key="index"
            >
              {{ error }}
            </div>
          </div>
          <el-form-item label="Email">
            <el-input v-model="emailShare" />
          </el-form-item>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showModalShare = false">Hủy</el-button>
              <el-button type="primary" @click="shareQuiz()"> Xác nhận </el-button>
            </div>
          </template>
        </el-dialog>
        <!-- End show modal share-->
        <!-- Quiz List -->
        <div class="col overflow-scroll app-emails-list">
          <div class="shadow-none border-0">
            <hr class="container-m-nx m-0" />
            <!-- Email List: Items -->
            <div class="email-list pt-0">
                <div class="row g-3 align-items-center mt-0 ms-2 mb-2 filter-report">
                    <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                        <label for="inputPassword6" class="col-form-label">Tạo bởi</label>
                        <select class="form-control" v-model="filterParams.created_by">
                            <option value="">Tất cả</option>
                            <option v-for="(value, key) in getCreatedBy()" :key="key" :value="value.id" :class="value.color">
                                {{ value.text }}
                            </option>
                        </select>
                    </div>
                    <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                        <label for="inputPassword6" class="col-form-label">User</label>
                        <select class="form-control">
                            <option value="">Tất cả</option>
                            
                        </select>
                    </div>
                    <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                        <label for="inputPassword6" class="col-form-label">Phân loại</label>
                        <select class="form-control" v-model="filterParams.category_id">
                            <option value="">Tất cả</option>
                            <option :value="item.id" v-if="listCategory.length > 0"
                                v-for="(item,index) in listCategory" :key="index">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                        <label for="inputPassword6" class="col-form-label">Mã code</label>
                        <input type="text" placeholder="Nhập mã code" v-model="filterParams.code"
                            class="form-control" aria-describedby="passwordHelpInline">
                    </div>
                    <el-form-item class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 mt-2 pt-2 align-items-center">
                        <label for="inputPassword6" class="col-form-label">Ngày tạo</label>
                        <el-date-picker style="height: 38px;" class="w-full"
                            type="datetimerange" start-placeholder="Start Date" end-placeholder="End Date"
                            v-model="filterParams.created_at" :default-time="defaultTime" />
                    </el-form-item>
                    <div class="col-xxl-1 col-xl-2 col-lg-4 col-md-6 mt-4 d-flex">
                        <div @click="handleCurrentChangeQuizze(1)" class="cursor-pointer mt-4">
                          <RiSearchLine class="text-primary pt-0 pb-0" />
                        </div>
                        <span @click="resetFilter" class="ms-1 mt-4"><RiRefreshLine size="20" class="text-danger cursor-pointer" /></span>
                    </div>
                </div>
                <div
                    v-if="listQuizzes.length == 0"
                    class="d-flex justify-content-center mt-4"
                    >
                    <h4 class="text-dark text-center">
                        Không tìm thấy kết quả!
                    </h4>
                </div>
                <table class="table" v-if="listQuizzes.length > 0">
                    <thead>
                        <tr>
                            <th scope="col" class="text-dark">#</th>
                            <th scope="col" class="fs-6 text-dark">Tên Quizz</th>
                            <th scope="col" class="fs-6 text-dark text-center">Số câu hỏi</th>
                            <th scope="col" class="fs-6 text-dark text-center">Lượt chơi</th>
                            <th scope="col" class="fs-6 text-dark text-center">Mã code</th>
                            <th scope="col" class="fs-6 text-dark">Người tạo</th>
                            <th scope="col" class="fs-6 text-dark">Danh mục</th>
                            <th scope="col" class="fs-6 text-dark text-center">Ngày tạo</th>
                            <th scope="col" class="fs-6 text-dark text-end">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="cursor-pointer"
                            v-for="(item, index) in listQuizzes" :key="index">
                            <th scope="row" class="text-dark">{{ index + 1 }}</th>
                            <td class="text-dark">{{ item.title }}</td>
                            <td class="text-dark text-center">{{ item.questions_count }}</td>
                            <td class="text-dark text-center">{{ item.rooms_count }}</td>
                            <td class="text-center">{{ item.code }}</td>
                            <td :class="getCreatedBy().find((type) => type.id == item.user?.type)?.color">
                                {{ item.user?.email }}
                            </td>
                            <td class="text-dark">
                                {{ item.category?.name }}
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
                                            <el-dropdown-item @click="showModalDeleteQuizz(item.id)">
                                                <RiDeleteBin7Fill size="15" class="me-1" /><span class="mt-1"> Xóa</span>
                                            </el-dropdown-item>
                                            <nuxt-link :to='"/admin/dashboard/my-library/" + item.id'>
                                                <el-dropdown-item>
                                                    <RiEyeCloseFill size="15" class="me-1" /><span class="mt-1"> Xem câu hỏi</span>
                                                </el-dropdown-item>
                                            </nuxt-link>
                                            <el-dropdown-item @click="handleShowModalShare(item.id)">
                                                <RiShare2Fill size="15" class="me-1" /><span class="mt-1"> Chia sẻ</span>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="row pagination mt-1" v-if="listQuizzes.length > 0">
                    <el-pagination class="d-flex justify-content-center" :page-size="perpage"
                        @current-change="handleCurrentChangeQuizze" background layout="prev, pager, next" :total="totalPageQuizzes" />
                </div>
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
import type { ErrorResponse, ItemQuizze, Category } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { RiMore2Fill, RiDeleteBin7Fill, RiCloseCircleLine, RiEyeCloseFill, RiShare2Fill, RiSearchLine, RiRefreshLine } from "@remixicon/vue";
import moment from "moment";
import { useMainStore } from "~/store";
import { CODE, RULES_VALIDATION } from "~/constants/application";
import { CREATED_BY } from "~/constants/quiz";

definePageMeta({
  layout: "admin-dashboard",
});

export default defineComponent({
  components: {
    RiMore2Fill,
    RiDeleteBin7Fill,
    RiCloseCircleLine,
    RiEyeCloseFill,
    RiShare2Fill,
    RiSearchLine,
    RiRefreshLine,
  },
  setup() {
    const store = useMainStore();
    const listQuizzes = ref<Array<ItemQuizze>>([]);
    const filterParams = ref({
      created_by: '',
      code: '',
      user_ids: '',
      category_id: '',
      created_at: []
    });
    const totalPageQuizzes = ref<number>(0);
    const currentPageAll = ref<number>(1);
    const currentPageShared = ref<number>(1);
    const currentPageCreatedByMe = ref<number>(1);
    const currentQuizzId = ref<string>("");
    const showModalDelete = ref<boolean>(false);
    const showModalWarningRoomRunning = ref<boolean>(false);
    const messageWarningRoomRunning = ref<string>("");
    const defaultTime = new Date();
    const errorMessageValidate = ref<Array<string> | []>([]);
    const perpage = ref<number>(10);
    const showModalShare = ref<boolean>(false);
    const currentQuizIdShare = ref<string>("");
    const emailShare = ref<string>("");
    const validateMessageEmailBeforeShare = ref<string[]>([]);
    const listCategory = ref<Array<Category>>([]);

    const searchQuizzes = async () => {
      await api.quizze.search(
        {
            page: currentPageAll.value,
            created_by: filterParams.value.created_by,
            code: filterParams.value.code,
            user_ids: filterParams.value.user_ids,
            category_id: filterParams.value.category_id,
            start_time: filterParams.value.created_at && filterParams.value.created_at[0] ? moment(new Date(filterParams.value.created_at[0])).format("YYYY-MM-DD HH:mm:ss") : '',
            end_time: filterParams.value.created_at && filterParams.value.created_at[1] ? moment(new Date(filterParams.value.created_at[1])).format("YYYY-MM-DD HH:mm:ss") : '',  
        },
        (res: any) => {
          listQuizzes.value = res.data;
          totalPageQuizzes.value = res.total;
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
      ElLoading.service({ fullscreen: true }).close();
    };

    const handleCurrentChangeQuizze = async (page: number) => {
      currentPageAll.value = page;
      await searchQuizzes();
    };

    const showModalDeleteQuizz = (id: string) => {
      showModalDelete.value = true;
      currentQuizzId.value = id;
    };

    const deleteQuizz = async () => {
      await api.quizze.deleteQuizze(
        currentQuizzId.value,
        (res: any) => {
          showModalDelete.value = false;
          ElNotification({
            title: "Success",
            message: "Xóa bộ câu hỏi thành công!",
            type: "success",
          });
          searchQuizzes();
        },
        (err: ErrorResponse) => {
          if (err.responseCode == CODE.ERROR_THROW.ROOM_IS_RUNNING) {
            showModalWarningRoomRunning.value = true;
            messageWarningRoomRunning.value = err.error.shift();
          } else {
            ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
          }
        }
      );
      showModalDelete.value = false;
    };

    const handleShowModalShare = (id: string) => {
      emailShare.value = "";
      showModalShare.value = true;
      currentQuizIdShare.value = id;
    };

    const shareQuiz = async () => {
      if (!validateEmailShare()) {
        return;
      }

      await api.quizze.shareQuiz(
        currentQuizIdShare.value,
        { email: emailShare.value },
        (res: any) => {
          showModalShare.value = false;
          ElNotification({
            title: "Success",
            message: "Chia sẻ bộ cảu hỏi thành công!",
            type: "success",
          });
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const validateEmailShare = () => {
      let isPassValidate: boolean = true;
      let errorMessagesValidate: string[] = [];
      const validator = useValidator();
      let requiredEmail = validator.required(emailShare.value, "Email");
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
        errorMessagesValidate.push("Email không hợp lệ!");
        isPassValidate = false;
      }

      if (emailShare.value == store.$state.user?.email) {
        errorMessagesValidate.push("Không thể chia sẻ cho chính mình!");
        isPassValidate = false;
      }

      validateMessageEmailBeforeShare.value = errorMessagesValidate;

      return isPassValidate;
    };

    const getCreatedBy = () => {
      return Object.values(CREATED_BY);
    };

    const formatDate = (date: string) => {
      return moment(date).format("DD/MM/YYYY HH:mm:ss");
    }

    const getCatogory = async () => {
      await api.quizze.listCategory((res: any) => {
          listCategory.value = res;
      }, (err: ErrorResponse) => {
          ElNotification({title: "Error", message: err.error.shift(), type: "error"});
      })
    }

    const resetFilter = async () => {
      filterParams.value = {
        created_by: '',
        code: '',
        user_ids: '',
        category_id: '',
        created_at: []
      }

      currentPageAll.value = 1;

      await searchQuizzes();
    }

    onMounted(async () => {
      ElLoading.service({ fullscreen: true });
      await getCatogory();
      await searchQuizzes();
    });

    return {
      handleCurrentChangeQuizze,
      deleteQuizz,
      showModalDeleteQuizz,
      handleShowModalShare,
      formatDate,
      shareQuiz,
      getCreatedBy,
      resetFilter,
      listQuizzes,
      listCategory,
      totalPageQuizzes,
      currentPageAll,
      defaultTime,
      errorMessageValidate,
      showModalWarningRoomRunning,
      messageWarningRoomRunning,
      perpage,
      showModalShare,
      showModalDelete,
      emailShare,
      validateMessageEmailBeforeShare,
      currentPageShared,
      currentPageCreatedByMe,
      filterParams,
      CREATED_BY,
    };
  },
});
</script>
<style scoped>
.border-custom {
  margin-top: 1rem;
  background: #fff;
  border-radius: 14px;
}
</style>
