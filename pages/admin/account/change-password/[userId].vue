<template>
    <div class="container">
      <div class="container-xxl flex-grow-1 container-p-y pt-1">
        <h4 class="fw-bold py-3"><span class="text-muted fw-light">Tài khoản /</span> Thông tin User</h4>
        <div class="row">
          <div class="col-md-12">
            <ul class="nav nav-pills flex-column flex-md-row mb-1">
              <li class="nav-item">
                <nuxt-link class="nav-link" :to="`/admin/account/${$route.params.userId}`"
                  ><i class="ti-xs ti ti-users me-1"></i> Tài khoản
              </nuxt-link>
              </li>
              <li class="nav-item">
                <button class="nav-link active">
                  <i class="ti-xs ti ti-lock me-1"></i> Mật khẩu
                </button>
              </li>
            </ul>
            <div class="card mb-4">
              <h5 class="card-header">Đổi mật khẩu</h5>
                  <div class="card-body">
                    <form method="POST" onsubmit="return false">
                      <div class="row">
                        <div class="mb-3 col-md-6 form-password-toggle">
                          <div
                            class="valiate-message-error col-12 mb-3 ms-0"
                            v-if="validateMessageCurrentPassword"
                          >
                            <el-alert
                              :title="validateMessageCurrentPassword"
                              type="error"
                              :closable="false"
                            />
                          </div>
                          <div
                            class="row valiate-message-error col-12 mb-3 ms-0"
                            v-if="validateMessageConfirmPassword"
                          >
                            <el-alert
                              :title="validateMessageConfirmPassword"
                              type="error"
                              :closable="false"
                            />
                          </div>
                          <div
                            class="valiate-message-error col-12 mb-3"
                            v-if="validateMessageNewPassword"
                          >
                            <el-alert
                              :title="validateMessageNewPassword"
                              type="error"
                              :closable="false"
                            />
                          </div>
                          <label class="form-label" for="currentPassword">Mật khẩu hiện tại</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              v-model="currentPassword"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" 
                              :disabled="disabledCurrentPassword()"
                              />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="mb-3 col-md-6 form-password-toggle">
                          <label class="form-label" for="newPassword">Mật khẩu mới</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              v-model="newPassword"
                              name="newPassword"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                          </div>
                        </div>
                        <div class="mb-3 col-md-6 form-password-toggle pe-0">
                          <label class="form-label" for="confirmPassword">Xâc nhận lại mật khẩu</label>
                          <div class="input-group input-group-merge">
                            <input
                              class="form-control"
                              type="password"
                              v-model="passwordConfirm"
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                          </div>
                        </div>
                        <div class="col-12 mb-4">
                          <h6>Yêu cầu về mật khẩu:</h6>
                          <ul class="ps-3 mb-0">
                            <li class="mb-1">Có độ dài từ 6 đến 100 ký tự</li>
                          </ul>
                        </div>
                        <div>
                          <button type="submit" @click="changePassword()" class="btn btn-primary me-2">Lưu thay đổi</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <!--/ Change Password -->
              </div>
            </div>
          </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import { RULES_VALIDATION } from "~/constants/application";
import { useValidator } from "#imports";
import { useMainStore } from "~/store";
import { USER_TYPE_ENUM } from "~/constants/user";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    components: {
    },
    setup() {
        const store = useMainStore();
        const userRole = ref<number>(store.$state.user?.type as number);
        const authId = ref<string>(store.$state.user?.id as string);
        const route = useRoute();
        const showModelEndGame = ref<boolean>(false);
        const currentPassword = ref<string>("");
        const validateMessageCurrentPassword = ref<string>("");
        const newPassword = ref<string>("");
        const validateMessageNewPassword = ref<string>("");
        const passwordConfirm = ref<string>("");
        const validateMessageConfirmPassword = ref<string>("");

        const disabledCurrentPassword = () => {
          let disabled = false;

          if (userRole.value == USER_TYPE_ENUM.SYSTEM) {
            disabled = authId.value != route.params.userId;
          } else {
            disabled = false;
          }

          return disabled;
        }

        const validateCurrentPassword = () => {
          const validateHelper = useValidator();
          let isPassAllValidate = true;
          let requiredCurrentPassword = validateHelper.required(currentPassword.value, "Mật khẩu cũ");
          let isLengthCurrentPassword = validateHelper.isLength(
            currentPassword.value,
            "Mật khẩu cũ",
            RULES_VALIDATION.PASSWORD_LENGTH.MIN,
            RULES_VALIDATION.PASSWORD_LENGTH.MAX
          );

          validateMessageCurrentPassword.value =
            requiredCurrentPassword === true ? "" : requiredCurrentPassword;
          isPassAllValidate = isPassAllValidate && requiredCurrentPassword === true;

          validateMessageCurrentPassword.value =
            isLengthCurrentPassword === true ? "" : isLengthCurrentPassword;
          isPassAllValidate = isPassAllValidate && isLengthCurrentPassword === true;

          return isPassAllValidate;
        }

        const validatePassword = () => {
          let isPassAllValidate = true;
          if (!disabledCurrentPassword()) {
            isPassAllValidate = validateCurrentPassword();
          }

          const validateHelper = useValidator();
          let requiredNewPassword = validateHelper.required(newPassword.value, "Mật khẩu mới");
          let isLengthPassword = validateHelper.isLength(
            newPassword.value,
            "Mật khẩu mới",
            RULES_VALIDATION.PASSWORD_LENGTH.MIN,
            RULES_VALIDATION.PASSWORD_LENGTH.MAX
          );

          let requiredPasswordConfirm = validateHelper.required(
            passwordConfirm.value,
            "Nhập lại mật khẩu"
          );
          let isLengthPasswordConfirm = validateHelper.isLength(
            passwordConfirm.value,
            "Mật khẩu nhập lại ",
            RULES_VALIDATION.PASSWORD_LENGTH.MIN,
            RULES_VALIDATION.PASSWORD_LENGTH.MAX,
          );

          validateMessageNewPassword.value =
            requiredNewPassword === true ? "" : requiredNewPassword;
          isPassAllValidate = isPassAllValidate && requiredNewPassword === true;

          validateMessageNewPassword.value =
            isLengthPassword === true ? "" : isLengthPassword;
          isPassAllValidate = isPassAllValidate && isLengthPassword === true;

          validateMessageConfirmPassword.value =
            requiredPasswordConfirm === true ? "" : requiredPasswordConfirm;
          isPassAllValidate = isPassAllValidate && requiredPasswordConfirm === true;

          validateMessageConfirmPassword.value =
            isLengthPasswordConfirm === true ? "" : isLengthPasswordConfirm;
          isPassAllValidate = isPassAllValidate && isLengthPasswordConfirm === true;
          console.log(passwordConfirm.value)

          if (passwordConfirm.value.length > 0 && newPassword.value !== passwordConfirm.value) {
            isPassAllValidate = false;
            validateMessageConfirmPassword.value =
              "Mật khẩu nhập lại không trùng";
          }

          return isPassAllValidate;
        };

        const changePassword = async () => {
          if (!validatePassword()) return ;

          ElLoading.service({ fullscreen: true })
          await api.user.changePassword(
            route.params.userId as string,
            {
              old_password: currentPassword.value,
              new_password: newPassword.value,
            },
            (res: any) => {
              ElNotification({
                title: "Success",
                message: "Đổi mật khẩu thành công!",
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
        
        onMounted(async () => {
        });

        return {
            showModelEndGame,
            authId,
            userRole,
            USER_TYPE_ENUM,
            disabledCurrentPassword,
            changePassword,
            validateMessageCurrentPassword,
            validateMessageNewPassword,
            validateMessageConfirmPassword,
            currentPassword,
            newPassword,
            passwordConfirm
        }
    }
})
</script>
<style scoped>
</style>