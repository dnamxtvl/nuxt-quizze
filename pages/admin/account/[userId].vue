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
                  :src="profile.avatar ? profile.avatar : '/img/avatars/14.png'"
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
                      @change="onFileChange"
                      hidden
                      accept="image/png, image/jpeg, image/gif, image/jpg"
                    />
                  </label>
                  <div class="text-muted">Allowed JPG,JPEG, GIF or PNG. Max size of 5096KB</div>
                </div>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body">
              <form id="formAccountSettings" method="POST" onsubmit="return false">
                <div
                  class="valiate-message-error col-md-6"
                  v-if="validateMessageNameBeforeSubmit"
                >
                  <el-alert
                    :title="validateMessageNameBeforeSubmit"
                    class="text-center"
                    type="error"
                    :closable="false"
                  />
                </div>
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
                      disabled
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="email" class="form-label">Loại tài khoản</label>
                    <select id="country" class="select2 form-select" v-model="profile.type" disabled>
                      <option value="3">Hệ Thống</option>
                      <option value="1">Người dùng</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="organization" class="form-label">Trạng thái</label>
                    <select id="country" class="select2 form-select" v-model="profile.disabled" disabled>
                      <option value="0">Hoạt động</option>
                      <option value="1">Vô hiệu hóa</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="organization" class="form-label">Xác thực Email</label>
                    <select id="country" class="select2 form-select" v-model="isVerified" disabled>
                      <option value="1">Đã xác thực</option>
                      <option value="0">Chưa xác thực</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6" v-if="profile.latest_login">
                    <label for="organization" class="form-label">Đăng nhập gần nhất lúc</label>
                    <input
                      class="form-control"
                      type="text"
                      autofocus
                      :value="profile.latest_login"
                      disabled
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <button type="button" @click="updateProfile()" class="btn btn-primary me-2">Lưu thay đổi</button>
                  <button type="button" @click="resetProfile()" class="btn btn-outline-warning">Đặt lại</button>
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
                    {{ !profile.disabled ? 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?' : 'Bạn có chắc chắn muốn kích hoạt lại tài khoản này?' }}
                  </h5>
                  <p class="mb-0">
                    {{ !profile.disabled ? 'Sau khi vô hiệu hóa, người dùng này sẽ không thể  đăng nhập được vào hệ thống!' : 'Sau khi kích hoạt lại, người dùng này có thể đăng nhập vào hệ thống!' }}
                  </p>
                </div>
              </div>
              <button type="submit" @click="deactivateAccount()" class="btn deactivate-account" :class="!profile.disabled ? 'btn-danger' : 'btn-success'">
                {{ !profile.disabled ? 'Vô hiệu hóa' : 'Kích hoạt lại' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
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
import { cloneDeep } from 'lodash-es';

definePageMeta({
  layout: "admin-dashboard",
});

interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

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
      email_verified_at: null,
      avatar: "",
      type: 0,
      latest_login: new Date(),
      latest_ip_login: "",
      disabled: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const isVerified = ref<number>(0);
    const isUpdate = ref<boolean>(false);
    const oldProfileSnapshot = ref<UserProfile>(cloneDeep(profile.value));
    const newAvatar = ref<File | null>(null);
    const validateMessageNameBeforeSubmit = ref<string>("");

    const formatDate = (date: string) => {
      return moment(date).format("DD/MM/YYYY HH:mm:ss");
    };

    const getProfile = async () => {
      ElLoading.service({ fullscreen: true });
      await api.auth.getProfile(
        route.params.userId as string,
        (res: any) => {
          profile.value = res;
          isVerified.value = profile.value.email_verified_at == null ? 0 : 1;
        },
        (err: any) => {
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        });

      ElLoading.service({ fullscreen: true }).close();
      isUpdate.value = false;
    };

    const resetProfile = async () => {
      if (isUpdate.value) {
        await getProfile();
        isUpdate.value = false;
        validateMessageNameBeforeSubmit.value = "";
      }
    };

    const onFileChange = (e: InputFileEvent) => {
      const file = e.target.files ? e.target.files[0] : null;
      let isPassValidate: boolean = true;
      if (file) {
        if (file.size > RULES_VALIDATION.AVATAR.MAX_SIZE_UPLOAD) {
          isPassValidate = false;
          ElNotification({
            title: "Error",
            message: `Avatar phải có dung lượng nhỏ hơn ${RULES_VALIDATION.AVATAR.MAX_SIZE_UPLOAD / 1000}KB`,
            type: "error",
          });
        }
      }

      if (isPassValidate && file) {
        profile.value.avatar = URL.createObjectURL(file);
        newAvatar.value = file;
      }
    }

    watch(profile, (newProfile) => {
      if (newProfile.name !== oldProfileSnapshot.value.name && oldProfileSnapshot.value.name != ""
        || newProfile.avatar !== oldProfileSnapshot.value.avatar && oldProfileSnapshot.value.avatar != ""
      ) {
        isUpdate.value = true;
      }
      oldProfileSnapshot.value = cloneDeep(newProfile);
    }, { deep: true });

    const validateProfile = () => {
      let validateHelper = useValidator();
      let isPassAllValidate = true; 
      let requiredUsername = validateHelper.required(profile.value.name, "Username");
      let isLengthUsername = validateHelper.isLength(
        profile.value.name,
        "Username",
        RULES_VALIDATION.USERNAME_LENGTH.MIN,
        RULES_VALIDATION.USERNAME_LENGTH.MAX
      );

      validateMessageNameBeforeSubmit.value = requiredUsername === true ? "" : requiredUsername;
      isPassAllValidate = isPassAllValidate && requiredUsername === true;

      validateMessageNameBeforeSubmit.value = isLengthUsername === true ? "" : isLengthUsername;
      isPassAllValidate = isPassAllValidate && isLengthUsername === true;

      return isPassAllValidate;
    }

    const updateProfile = async () => {
      if (!isUpdate.value) return;
      if (!validateProfile()) return;

      ElLoading.service({ fullscreen: true });
      const formData = new FormData();
      formData.append("name", profile.value.name);
      formData.append("avatar", newAvatar.value as File);

      await api.auth.updateProfile(
        route.params.userId as string,
        formData,
        (res: any) => {
          ElNotification({
            title: "Success",
            message: "Cập nhật thành công!",
            type: "success",
          });

          navigateTo("/admin/dashboard/list-user");
        },
        (err: any) => {
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        }
      );

      ElLoading.service({ fullscreen: true }).close();
    }

    const disabledUser = async () => {
      ElLoading.service({ fullscreen: true });
      await api.user.disable(
        route.params.userId as string,
        (res: any) => {
          ElNotification({
            title: "Success",
            message: "Vô hiệu hóa tài khoản thành công!",
            type: "success",
          });

          navigateTo("/admin/dashboard/list-user");
        },
        (err: any) => {
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        }
      );

      ElLoading.service({ fullscreen: true }).close();
    }

    const activeUser = () => {
      ElLoading.service({ fullscreen: true });
      api.user.active(
        route.params.userId as string,
        (res: any) => {
          ElNotification({
            title: "Success",
            message: "Kích hoạt lại tài khoản thành công!",
            type: "success",
          });

          navigateTo("/admin/dashboard/list-user");
        },
        (err: any) => {
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        }
      );

      ElLoading.service({ fullscreen: true }).close();
    }

    const deactivateAccount = () => {
      if (!profile.value.disabled) {
        disabledUser();
      } else {
        activeUser();
      }
    }

    onMounted(async () => {
      await getProfile();
    });

    return {
      formatDate,
      authId,
      profile,
      isVerified,
      resetProfile,
      isUpdate,
      onFileChange,
      updateProfile,
      validateMessageNameBeforeSubmit,
      deactivateAccount,
    };
  },
});
</script>
<style scoped>
</style>
