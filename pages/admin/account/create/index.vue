<template>
    <div class="container">
      <div class="container-xxl flex-grow-1 container-p-y pt-1">
        <h4 class="fw-bold py-3">
          <span class="text-muted fw-light">Tài khoản /</span> Tạo mới
        </h4>
        <div class="row">
          <div class="col-md-12">
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
                    <div class="text-muted">Allowed JPG,JPEG, GIF or PNG. Max size of 2048KB</div>
                  </div>
                </div>
              </div>
              <hr class="my-0" />
              <div class="card-body">
                <div
                    class="valiate-message-error mb-1 col-md-12"
                    v-if="validateMessageNameBeforeSubmit">
                    <el-alert
                        :title="validateMessageNameBeforeSubmit"
                        class="text-center"
                        type="error"
                        :closable="false"
                    />
                </div>
                <div
                    class="valiate-message-error mb-1 col-md-12"
                    v-if="validateMessageEmailBeforeSubmit">
                    <el-alert
                        :title="validateMessageEmailBeforeSubmit"
                        class="text-center"
                        type="error"
                        :closable="false"
                    />
                </div>
                <div
                    class="valiate-message-error mb-1 col-md-12"
                    v-if="validateMessagePasswordBeforeSubmit">
                    <el-alert :title="validateMessagePasswordBeforeSubmit"
                        class="text-center"
                        type="error"
                        :closable="false"
                    />
                </div>
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
                      <select id="country" class="select2 form-select" v-model="profile.type">
                        <option value="1">Người dùng</option>
                        <option value="3">Hệ Thống</option>
                      </select>
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="organization" class="form-label">Mật khẩu</label>
                        <input
                          class="form-control"
                          type="password"
                          v-model="profile.password"
                        />
                      </div>
                  </div>
                  <div class="mt-2">
                    <button type="button" @click="createUser()" class="btn btn-primary me-2">Lưu thay đổi</button>
                  </div>
                </form>
              </div>
              <!-- /Account -->
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
import { RULES_VALIDATION } from "~/constants/application";
import { useValidator } from "#imports";

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
        const profile = ref({
            name: "",
            email: "",
            avatar: "",
            type: 1,
            password: "",
        });
        const newAvatar = ref<File | null>(null);
        const validateMessageNameBeforeSubmit = ref<string>("");
        const validateMessagePasswordBeforeSubmit = ref<string>("");
        const validateMessageEmailBeforeSubmit = ref<string>("");

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

            let requiredPassword = validateHelper.required(profile.value.password, "Mật khẩu");
            let isLengthPassword = validateHelper.isLength(
                profile.value.password,
                "Mật khẩu",
                RULES_VALIDATION.PASSWORD_LENGTH.MIN,
                RULES_VALIDATION.PASSWORD_LENGTH.MAX
            );

            let requiredEmail = validateHelper.required(profile.value.email, "Email");
            let isLengthEmail = validateHelper.isLength(
                profile.value.email,
                "Email",
                RULES_VALIDATION.EMAIL_LENGTH.MIN,
                RULES_VALIDATION.EMAIL_LENGTH.MAX
            );
            let isValidEmail = validateHelper.isInvalidEmail(profile.value.email, false);

            validateMessageNameBeforeSubmit.value = requiredUsername === true ? "" : requiredUsername;
            isPassAllValidate = isPassAllValidate && requiredUsername === true;

            validateMessageNameBeforeSubmit.value = isLengthUsername === true ? "" : isLengthUsername;
            isPassAllValidate = isPassAllValidate && isLengthUsername === true;

            validateMessagePasswordBeforeSubmit.value = requiredPassword === true ? "" : requiredPassword;
            isPassAllValidate = isPassAllValidate && requiredPassword === true;

            validateMessagePasswordBeforeSubmit.value = isLengthPassword === true ? "" : isLengthPassword;
            isPassAllValidate = isPassAllValidate && isLengthPassword === true;

            validateMessageEmailBeforeSubmit.value = requiredEmail === true ? "" : requiredEmail;
            isPassAllValidate = isPassAllValidate && requiredEmail === true;

            validateMessageEmailBeforeSubmit.value = isLengthEmail === true ? "" : isLengthEmail;
            isPassAllValidate = isPassAllValidate && isLengthEmail === true;

            if (!isValidEmail) {
                validateMessageEmailBeforeSubmit.value = "Email không hợp lệ";
                isPassAllValidate = false;
            }

            return isPassAllValidate;
        }

        const createUser = async () => {
            if (!validateProfile()) return;

            ElLoading.service({ fullscreen: true });
            const formData = new FormData();
            formData.append("username", profile.value.name);
            formData.append("email", profile.value.email);
            formData.append("password", profile.value.password);
            formData.append("type", profile.value.type.toString());
            if (newAvatar.value) formData.append("avatar", newAvatar.value as File);

            await api.auth.createUser(
                formData,
                (res: any) => {
                    ElNotification({
                        title: "Success",
                        message: "Cấp tài khoản thành công!",
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

        return {
            profile,
            onFileChange,
            createUser,
            validateMessageNameBeforeSubmit,
            validateMessagePasswordBeforeSubmit,
            validateMessageEmailBeforeSubmit
        };
    },
});
</script>
<style scoped>
</style>
  