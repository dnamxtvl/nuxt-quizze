<template>
  <div class="container">
    <div class="container-xxl flex-grow-1 container-p-y pt-1">
      <h4 class="fw-bold py-3">
        <span class="text-muted fw-light">Tài khoản /</span> Thông tin User
      </h4>
      <div class="row">
        <div class="col-md-12">
          <ul class="nav nav-pills flex-column flex-md-row mb-1">
            <li class="nav-item">
              <button class="nav-link active"
                ><i class="ti-xs ti ti-users me-1"></i> Tài khoản
            </button>
            </li>
            <li class="nav-item">
                <nuxt-link class="nav-link" :to="`/admin/account/change-password/${$route.params.userId}`">
                    <i class="ti-xs ti ti-lock me-1"></i> Mật khẩu
                </nuxt-link>
            </li>
          </ul>
          <div class="card mb-4">
            <h5 class="card-header">Thông tin cá nhân</h5>
            <!-- Account -->
            <div class="card-body">
              <div class="d-flex align-items-start align-items-sm-center gap-4">
                <img
                  src="../../../assets/img/avatars/14.png"
                  alt="user-avatar"
                  class="d-block w-px-100 h-px-100 rounded"
                  id="uploadedAvatar"
                />
                <div class="button-wrapper">
                  <label for="upload" class="btn btn-primary me-2 mb-3" tabindex="0">
                    <span class="d-none d-sm-block">Tải lên avatar</span>
                    <i class="ti ti-upload d-block d-sm-none"></i>
                    <input
                      type="file"
                      id="upload"
                      class="account-file-input"
                      hidden
                      accept="image/png, image/jpeg"
                    />
                  </label>
                  <button
                    type="button"
                    class="btn btn-label-secondary account-image-reset mb-3"
                  >
                    <i class="ti ti-refresh-dot d-block d-sm-none"></i>
                    <span class="d-none d-sm-block">Đặt lại</span>
                  </button>

                  <div class="text-muted">Allowed JPG, GIF or PNG. Max size of 800K</div>
                </div>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body">
              <form id="formAccountSettings" method="POST" onsubmit="return false">
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="firstName" class="form-label">Tên</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="profile.name"
                      autofocus
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="lastName" class="form-label">Email</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="profile.email"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="email" class="form-label">Loại tài khoản</label>
                    <select id="country" class="select2 form-select">
                      <option value="">Select</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="organization" class="form-label">Trạng thái</label>
                    <input
                      type="text"
                      class="form-control"
                      id="organization"
                      name="organization"
                      value="Pixinvent"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <button type="submit" class="btn btn-primary me-2">Lưu thay đổi</button>
                  <button type="reset" class="btn btn-label-secondary">Hủy</button>
                </div>
              </form>
            </div>
            <!-- /Account -->
          </div>
          <div class="card">
            <h5 class="card-header">Vô hiệu hóa tài khoản</h5>
            <div class="card-body">
              <div class="mb-3 col-12 mb-0">
                <div class="alert alert-warning">
                  <h5 class="alert-heading mb-1">
                    Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?
                  </h5>
                  <p class="mb-0">
                    Sau khi vô hiệu hóa,người dùng này sẽ không thể đăng nhập được vào hệ
                    thống!
                  </p>
                </div>
              </div>
              <form id="formAccountDeactivation" onsubmit="return false">
                <button type="submit" class="btn btn-danger deactivate-account">
                  Vô hiệu hóa
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type {
  UserProfile,
} from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import moment from "moment";
import { useRoute } from "vue-router";
import { RULES_VALIDATION } from "~/constants/application";
import { useValidator } from "#imports";
import { useMainStore } from "~/store";

definePageMeta({
  layout: "admin-dashboard",
});

export default defineComponent({
  components: {
  },
  setup() {
    const store = useMainStore();
    const authId = ref<string>(store.$state.user?.id as string);
    const route = useRoute();
    const profile = ref<UserProfile>({
      id: "",
      name: "",
      email: "",
      avatar: "",
      type: 0,
      latest_login: new Date(),
      latest_ip_login: "",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const formatDate = (date: string) => {
      return moment(date).format("DD/MM/YYYY HH:mm:ss");
    };

    const getProfile = async () => {
      await api.auth.getProfile(
        route.params.userId,
        (res: any) => {
          profile.value = res;
          console.log(profile.value);
        },
        (err: any) => {
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        });

        ElLoading.service({ fullscreen: true }).close();
    };

    onMounted(async () => {
      ElLoading.service({ fullscreen: true });
      await getProfile();
    });

    return {
      formatDate,
      authId,
      profile,
    };
  },
});
</script>
<style scoped>
</style>
