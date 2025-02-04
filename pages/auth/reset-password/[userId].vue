<template>
  <div class="authentication-wrapper authentication-cover authentication-bg">
    <div class="authentication-inner row">
      <!-- /Left Text -->
      <div class="d-none d-lg-flex col-lg-7 p-0">
        <div
          class="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center"
        >
          <img
            src="../../../assets/img/illustrations/auth-reset-password-illustration-light.png"
            alt="auth-reset-password-cover"
            class="img-fluid my-5 auth-illustration"
            data-app-light-img="illustrations/auth-reset-password-illustration-light.png"
            data-app-dark-img="illustrations/auth-reset-password-illustration-dark.png"
          />
        </div>
      </div>
      <!-- /Left Text -->

      <!-- Reset Password -->
      <div class="d-flex col-12 col-lg-5 align-items-center p-4 p-sm-5">
        <div class="w-px-400 mx-auto">
          <!-- Logo -->
          <div class="app-brand mb-4">
            <a href="index.html" class="app-brand-link gap-2">
              <span class="app-brand-logo demo">
                <svg
                  width="32"
                  height="22"
                  viewBox="0 0 32 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                    fill="#7367F0"
                  />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                    fill="#161616"
                  />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                    fill="#161616"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                    fill="#7367F0"
                  />
                </svg>
              </span>
            </a>
          </div>
          <!-- /Logo -->
          <h3 class="mb-1 fw-bold">Đặt lại mật khẩu 🔒</h3>
          <p class="mb-4">cho email<span class="fw-bold"> ...@..</span></p>
          <div class="mb-0 form-password-toggle">
            <label class="form-label" for="password">Mật khẩu mới</label>
            <div class="input-group input-group-merge">
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="password"
                name="password"
                placeholder="············"
                aria-describedby="password"
              />
            </div>
            <div
              class="valiate-message-error mb-3"
              v-if="validateMessagePasswordBeforeSubmit"
            >
              <el-alert
                :title="validateMessagePasswordBeforeSubmit"
                type="error"
                :closable="false"
              />
            </div>
          </div>
          <div class="mb-0 mt-3 form-password-toggle">
            <label class="form-label" for="confirm-password">Nhập lại mật khẩu</label>
            <div class="input-group input-group-merge">
              <input
                type="password"
                id="confirm-password"
                v-model="passwordConfirm"
                class="form-control"
                name="confirm-password"
                placeholder="············"
                aria-describedby="password"
              />
            </div>
          </div>
          <div
            class="valiate-message-error mb-3"
            v-if="validateMessagePasswordConfirmBeforeSubmit"
          >
            <el-alert
              :title="validateMessagePasswordConfirmBeforeSubmit"
              type="error"
              :closable="false"
            />
          </div>
          <button
            type="button"
            @click="resetPassword"
            class="btn btn-primary d-grid w-100 mb-3 mt-3"
          >
            Xác nhận
          </button>
          <div class="text-center">
            <nuxt-link to="/admin/login">
              <i class="ti ti-chevron-left scaleX-n1-rtl"></i>
              Quay về đăng nhập
            </nuxt-link>
          </div>
        </div>
      </div>
      <!-- /Reset Password -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "~/api/axios";
import { ElLoading, ElNotification } from "element-plus";
import { RULES_VALIDATION } from "~/constants/application";

export default defineComponent({
  setup() {
    const route = useRoute();
    const password = ref<string>("");
    const passwordConfirm = ref<string>("");
    const errorMessages = ref<Array<string>>([]);
    const validateMessagePasswordBeforeSubmit = ref<string>("");
    const validateMessagePasswordConfirmBeforeSubmit = ref<string>("");

    const resetPassword = () => {
      if (!validatePassword()) {
        return;
      }

      ElLoading.service({ fullscreen: true });
      api.auth.resetPassword(
        {
          password: password.value,
          user_id: route.params.userId,
          token: route.query.token as string,
          password_confirmation: passwordConfirm.value,
        },
        (res: any) => {
          ElLoading.service({ fullscreen: true }).close();
          ElNotification({
            title: "Success",
            message: "Đổi mật khẩu thành công!",
            type: "success",
          });

          navigateTo("/admin/login");
        },
        (err: any) => {
          ElLoading.service({ fullscreen: true }).close();
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
        }
      );
    };

    const validatePassword = () => {
      const validateHelper = useValidator();
      let isPassAllValidate = true;
      let requiredPassword = validateHelper.required(password.value, "Mật khẩu");
      let isLengthPassword = validateHelper.isLength(
        password.value,
        "Mật khẩu",
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
        RULES_VALIDATION.PASSWORD_LENGTH.MAX
      );

      validateMessagePasswordBeforeSubmit.value =
        requiredPassword === true ? "" : requiredPassword;
      isPassAllValidate = isPassAllValidate && requiredPassword === true;

      validateMessagePasswordBeforeSubmit.value =
        isLengthPassword === true ? "" : isLengthPassword;
      isPassAllValidate = isPassAllValidate && isLengthPassword === true;

      validateMessagePasswordConfirmBeforeSubmit.value =
        requiredPasswordConfirm === true ? "" : requiredPasswordConfirm;
      isPassAllValidate = isPassAllValidate && requiredPasswordConfirm === true;

      validateMessagePasswordConfirmBeforeSubmit.value =
        isLengthPasswordConfirm === true ? "" : isLengthPasswordConfirm;
      isPassAllValidate = isPassAllValidate && isLengthPasswordConfirm === true;

      if (passwordConfirm.value.length > 0 && password.value !== passwordConfirm.value) {
        isPassAllValidate = false;
        validateMessagePasswordConfirmBeforeSubmit.value =
          "Mật khẩu nhập lại không trùng";
      }

      return isPassAllValidate;
    };

    onMounted(async () => {});

    return {
      password,
      passwordConfirm,
      errorMessages,
      validateMessagePasswordBeforeSubmit,
      validateMessagePasswordConfirmBeforeSubmit,
      resetPassword,
    };
  },
});
</script>
<style scoped>
.authentication-wrapper.authentication-cover
  .authentication-inner
  .auth-cover-bg
  .auth-illustration {
  max-height: 65%;
  z-index: 1;
}

.authentication-wrapper.authentication-cover .authentication-inner .auth-cover-bg {
  width: 100%;
  margin: 2rem 0 2rem 2rem;
  height: calc(100vh - 4rem);
  border-radius: 1.125rem;
  position: relative;
  background-color: #f8f7fa;
}

.authentication-wrapper.authentication-cover .authentication-inner {
  height: 100%;
  margin: auto 0;
}
</style>
