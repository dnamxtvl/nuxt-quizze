<template>
  <div class="row ms-4 me-4">
    <div class="">
      <div class="row g-0">
        <el-dialog
          v-model="showModalDelete"
          :show-close="false"
          title="Warning"
          width="500"
          align-center
        >
          <span>Bạn có chắc chắn muốn xóa user này?</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showModalDelete = false">Hủy</el-button>
              <el-button type="primary" @click="deleteUser"> Xác nhận </el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog
          v-model="showModalDisable"
          :show-close="false"
          title="Warning"
          width="500"
          align-center
        >
          <span>Bạn có chắc chắn muốn vô hiệu hóa user này?</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showModalDisable = false">Hủy</el-button>
              <el-button type="primary" @click="disableUser"> Xác nhận </el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog
          v-model="showModalActive"
          :show-close="false"
          title="Warning"
          width="500"
          align-center
        >
          <span>Bạn có chắc chắn muốn kích hoạt lại user này?</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showModalActive = false">Hủy</el-button>
              <el-button type="primary" @click="activeUser"> Xác nhận </el-button>
            </div>
          </template>
        </el-dialog>
        <!--/ Quiz Sidebar -->
        <!-- Room List -->
        <div class="col app-emails-list">
          <div class="shadow-none border-0">
            <hr class="container-m-nx m-0" />
            <!-- Email List: Items -->
            <div class="row g-3 align-items-center mt-0 ms-2 mb-2 filter-report">
              <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                <label for="inputPassword6" class="col-form-label">Loại</label>
                <select class="form-control" v-model="filterParams.created_by">
                  <option value="">Tất cả</option>
                  <option
                    v-for="(value, key) in getCreatedBy()"
                    :key="key"
                    :value="value.id"
                    :class="value.color"
                  >
                    {{ value.text }}
                  </option>
                </select>
              </div>
              <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                <label for="inputPassword6" class="col-form-label">Tên/Email</label>
                <el-select
                  v-model="filterParams.user_ids"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Nhập từ khóa tìm kiếm"
                  remote-show-suffix
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6">
                <label for="inputPassword6" class="col-form-label">Trạng thái</label>
                <select class="form-control" v-model="filterParams.disabled">
                  <option value="">Chọn trạng thái</option>
                  <option
                    :value="item.id"
                    v-for="(item, index) in getUserStatus()"
                    :key="index"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>
              <el-form-item
                class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 mt-2 pt-2 align-items-center"
              >
                <label for="inputPassword6" class="col-form-label">Ngày Tạo</label>
                <el-date-picker
                  style="height: 38px"
                  class="w-full"
                  v-model="filterParams.created_at"
                  type="datetimerange"
                  start-placeholder="Start Date"
                  end-placeholder="End Date"
                  :default-time="defaultTime"
                />
              </el-form-item>
              <div class="col-xxl-2 col-xl-4 col-lg-6 col-md-6 mt-4 pt-1 d-flex">
                <div @click="getListUser" class="cursor-pointer mt-4">
                  <RiSearchLine class="text-primary pt-0 pb-0" />
                </div>
                <span @click="resetFilter" class="ms-1 mt-4"
                  ><RiRefreshLine size="20" class="text-danger cursor-pointer"
                /></span>
              </div>
            </div>
            <table class="table" v-if="listUser.length > 0">
              <thead>
                <tr>
                  <th scope="col" class="text-dark">#</th>
                  <th scope="col" class="fs-6 text-dark text-start">Loại tài khoản</th>
                  <th scope="col" class="fs-6 text-dark">Tên</th>
                  <th scope="col" class="fs-6 text-dark">Email</th>
                  <th scope="col" class="fs-6 text-dark">Bộ câu hỏi</th>
                  <th scope="col" class="fs-6 text-dark text-center">Trạng thái</th>
                  <th scope="col" class="fs-6 text-dark text-center">Ngày tạo</th>
                  <th scope="col" class="fs-6 text-dark text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in listUser"
                  :key="index"
                >
                  <th scope="row" class="text-dark">{{ index + 1 }}</th>
                  <td class="text-dark text-start">
                    <span
                      :class="
                        'badge text-white ' +
                        getCreatedBy().find((type) => type.id == item.type)?.bg_color
                      "
                    >
                      {{ getCreatedBy().find((type) => type.id == item.type)?.text }}
                    </span>
                  </td>
                  <td class="text-primary">{{ item.name }}</td>
                  <td class="text-dark">{{ item.email }}</td>
                  <td class="text-dark text-center">{{ item.quizzes_count }}</td>
                  <td class="text-white text-center">
                    <span
                      :class="
                        'text-start badge ' +
                        getUserStatus().find((status) => status.id == item.disabled)
                          ?.bgColor
                      "
                    >
                      {{
                        getUserStatus().find((status) => status.id == item.disabled)?.text
                      }}
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
                          <el-dropdown-item @click="showModalDeleteUser(item.id)">
                            <RiDeleteBin7Fill size="15" class="me-1" /><span class="mt-1">
                              Xóa</span
                            >
                          </el-dropdown-item>
                          <el-dropdown-item
                            @click="showModalDisableUser(item.id)"
                            v-if="item.disabled == 0"
                          >
                            <RiCloseFill size="15" class="me-1" /><span class="mt-1"
                              >Vô hiệu hóa</span
                            >
                          </el-dropdown-item>
                          <el-dropdown-item
                            @click="showModalActiveUser(item.id)"
                            v-if="item.disabled == 1"
                          >
                            <RiCloseFill size="15" class="me-1" /><span class="mt-1"
                              >Kích hoạt lại</span
                            >
                          </el-dropdown-item>
                          <nuxt-link
                            :to="'/admin/account/' + item.id"
                          >
                            <el-dropdown-item>
                              <RiEyeCloseFill size="15" class="me-1" /><span class="mt-1">
                                Profile</span
                              >
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
          <div class="empty-section mt-4" v-if="listUser.length == 0">
            <h4 class="text-center">Không tìm thấy User nào!</h4>
          </div>
          <div class="row pagination mt-1" v-if="listUser.length > 0">
            <el-pagination
              class="d-flex justify-content-center"
              :page-size="defalutPerpage"
              @current-change="handleCurrentChange"
              background
              layout="prev, pager, next"
              :total="totalUsers"
            />
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
import {
  RiMore2Fill,
  RiDeleteBin7Fill,
  RiRefreshLine,
  RiEyeCloseFill,
  RiSearchLine,
  RiCloseFill,
} from "@remixicon/vue";
import moment from "moment";
import { CREATED_BY } from "~/constants/quiz";
import { USER_SETTING, USER_STATUS_ENUM } from "~/constants/user";

definePageMeta({
  layout: "admin-dashboard",
});

interface UserDetail {
  id: string;
  name: string;
  email: string;
  type: string;
  quizzes_count: number;
  disabled: number;
  created_at: string;
  updated_at: string;
}

interface ListItem {
  value: string
  label: string
}

export default defineComponent({
  components: {
    RiMore2Fill,
    RiDeleteBin7Fill,
    RiRefreshLine,
    RiEyeCloseFill,
    RiSearchLine,
    RiCloseFill,
  },
  setup() {
    const currentPage = ref<number>(1);
    const defalutPerpage = ref<number>(USER_SETTING.PER_PAGE);
    const totalUsers = ref<number>(0);
    const showModalDelete = ref<boolean>(false);
    const showModalDisable = ref<boolean>(false);
    const showModalActive = ref<boolean>(false);
    const listUser = ref<UserDetail[]>([]);
    const currentUserId = ref<string>("");
    const defaultTime = new Date();
    const filterParams = ref({
      created_by: "",
      user_ids: [],
      disabled: "",
      created_at: [],
    });
    const options = ref<ListItem[]>([]);
    const loading = ref(false);

    const getListUser = async () => {
      let paramsFilter = {
        page: currentPage.value,
        role: filterParams.value.created_by,
        disabled: filterParams.value.disabled,
        user_ids: filterParams.value.user_ids,
        start_time:
          filterParams.value.created_at && filterParams.value.created_at[0]
            ? moment(new Date(filterParams.value.created_at[0])).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "",
        end_time:
          filterParams.value.created_at && filterParams.value.created_at[1]
            ? moment(new Date(filterParams.value.created_at[1])).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "",
      };

      await api.user.list(
        paramsFilter,
        (res: any) => {
          ElLoading.service({ fullscreen: true }).close();
          listUser.value = res.data;
          console.log(listUser.value);
          totalUsers.value = res.total;
        },
        (err: ErrorResponse) => {
          ElLoading.service({ fullscreen: true }).close();
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const formatDate = (date: string) => {
      return moment(date).format("DD/MM/YYYY HH:mm:ss");
    };

    const showModalDeleteUser = (id: string) => {
      currentUserId.value = id;
      showModalDelete.value = true;
    };

    const showModalDisableUser = (id: string) => {
      currentUserId.value = id;
      showModalDisable.value = true;
    };

    const showModalActiveUser = (id: string) => {
      currentUserId.value = id;
      showModalActive.value = true;
    };

    const disableUser = async () => {
      await api.user.disable(
        currentUserId.value,
        (res: any) => {
          showModalDisable.value = false;
          ElNotification({
            title: "Success",
            message: "Vô hiệu hóa user thành công!",
            type: "success",
          });
          getListUser();
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const activeUser = async () => {
      await api.user.active(
        currentUserId.value,
        (res: any) => {
          showModalActive.value = false;
          ElNotification({
            title: "Success",
            message: "Kích hoạt lại user thành công!",
            type: "success",
          });
          getListUser();
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const deleteUser = async () => {
      await api.user.delete(
        currentUserId.value,
        (res: any) => {
          showModalDelete.value = false;
          ElNotification({
            title: "Success",
            message: "Xóa user thành công!",
            type: "success",
          });
          getListUser();
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const resetFilter = async () => {
      filterParams.value = {
        created_by: "",
        user_ids: "",
        disabled: "",
        created_at: [],
      };

      currentPage.value = 1;
      await getListUser();
    };

    const handleCurrentChange = async (page: number) => {
      currentPage.value = page;
      await getListUser();
    };

    const getCreatedBy = () => {
      return Object.values(CREATED_BY);
    };

    const getUserStatus = () => {
      return USER_STATUS_ENUM;
    };

    const remoteMethod = async (query: string) => {
      if (query) {
        loading.value = true
        setTimeout(async () => {
          loading.value = false
          await api.user.searchELK(
            query,
            (res: any) => {
              options.value = res.map((item: any) => {
                return { value: item.id, label: item.name + ':' + item.email }
              })
            },
            (err: ErrorResponse) => {
              ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
            }
          )
        }, 500)
      } else {
        options.value = []
      }
    }

    onMounted(async () => {
      ElLoading.service({ fullscreen: true });
      await getListUser();
    });

    return {
      showModalDeleteUser,
      showModalDisableUser,
      handleCurrentChange,
      showModalActiveUser,
      getListUser,
      formatDate,
      resetFilter,
      deleteUser,
      getCreatedBy,
      getUserStatus,
      disableUser,
      activeUser,
      showModalDelete,
      showModalDisable,
      showModalActive,
      listUser,
      totalUsers,
      defaultTime,
      filterParams,
      defalutPerpage,
      loading,
      remoteMethod,
      options,
    };
  },
});
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  height: 38px;
}
</style>
