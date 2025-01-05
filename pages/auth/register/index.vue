<template>
<div class="authentication-wrapper authentication-cover authentication-bg">
    <div class="authentication-inner row">
        <!-- /Left Text -->
        <div class="d-none d-lg-flex col-lg-7 p-0">
          <div class="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
            <img
              src="../../../assets/img/illustrations/auth-register-illustration-light.png"
              alt="auth-register-cover"
              class="img-fluid my-5 auth-illustration"
              data-app-light-img="illustrations/auth-register-illustration-light.png"
              data-app-dark-img="illustrations/auth-register-illustration-dark.png" />
          </div>
        </div>
        <!-- /Left Text -->

        <!-- Register -->
        <div class="d-flex col-12 col-lg-5 align-items-center p-sm-5 p-4">
          <div class="w-px-400 mx-auto">
            <!-- Logo -->
            <div class="app-brand mb-4">
              <a href="index.html" class="app-brand-link gap-2">
                <span class="app-brand-logo demo">
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                      fill="#7367F0" />
                    <path
                      opacity="0.06"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                      fill="#161616" />
                    <path
                      opacity="0.06"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                      fill="#161616" />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                      fill="#7367F0" />
                  </svg>
                </span>
              </a>
            </div>
            <!-- /Logo -->
            <h3 class="mb-1 fw-bold">Cuộc phưu lưu bắt đầu từ đây 🚀</h3>
            <p class="mb-4">Tham gia ngôi nhà chung VibeQuiz ngay!</p>
            <div
              class="valiate-message-error mt-2"
              v-if="errorMessages.length > 0"
              v-for="(error, index) in errorMessages"
            >
              <el-alert
                :title="error"
                type="error"
                class="ps-2 pe-2"
                :closable="false"
                :key="index"
              />
            </div>
            <form class="mb-3" @submit="register">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="username"
                  id="username"
                  name="username"
                  placeholder="Nhập tên của bạn"
                  autofocus />
              </div>
              <div
                class="valiate-message-error col-12"
                v-if="validateMessageUsernameBeforeSubmit"
              >
                <el-alert
                  :title="validateMessageUsernameBeforeSubmit"
                  class="text-center"
                  type="error"
                  :closable="false"
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" v-model="email" name="email" placeholder="Nhập email của bạn" />
              </div>
              <div
                class="valiate-message-error col-12"
                v-if="validateMessageEmailBeforeSubmit"
              >
                <el-alert
                  :title="validateMessageEmailBeforeSubmit"
                  class="text-center"
                  type="error"
                  :closable="false"
                />
              </div>
              <div class="mb-3 form-password-toggle">
                <label class="form-label" for="password">Password</label>
                <div class="input-group input-group-merge">
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    v-model="password"
                    name="password"
                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                    aria-describedby="password" />
                </div>
              </div>
              <div
                class="valiate-message-error col-12"
                v-if="validateMessagePasswordBeforeSubmit"
              >
                <el-alert
                  :title="validateMessagePasswordBeforeSubmit"
                  class="text-center"
                  type="error"
                  :closable="false"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                  <label class="form-check-label" for="terms-conditions">
                    Tôi đồng ý với
                    <a href="javascript:void(0);">Các điều khoản dịch vụ</a>
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary d-grid w-100">Đăng ký</button>
            </form>
            <p class="text-center">
              <span>Bạn đã có tài khoản?</span>
              <nuxt-link to="/admin/login">
                <span>Đăng nhập tại đây</span>
              </nuxt-link>
            </p>
            <div class="divider my-4">
              <div class="divider-text">or</div>
            </div>
            <div class="d-flex justify-content-center">
              <GoogleSignInButton
                @success="handleLoginSuccess"
                @error="handleLoginError"
              ></GoogleSignInButton>
            </div>
          </div>
        </div>
        <!-- /Register -->
      </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "~/api/axios";
import { useValidator } from "#imports";
import { RULES_VALIDATION, ERROR_CODE, CODE } from "~/constants/application";
import helperApp from "~/utils/helper";
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

export default defineComponent({
  components: {
    GoogleSignInButton
  },
  setup() {
    const username = ref<string>(""); 
    const email = ref<string>("");
    const password = ref<string>("");
    const errorMessages = ref<Array<string>>([]);
    const validateMessageEmailBeforeSubmit = ref<string>("");
    const validateMessagePasswordBeforeSubmit = ref<string>("");
    const validateMessageUsernameBeforeSubmit = ref<string>("");
    const showModalOTPConfirm = ref<boolean>(false);
    const token = ref<string>("");
    
    const validateRegisterParams = () => {
      const validateHelper = useValidator();
      let isPassAllValidate = true;
      let requiredEmail = validateHelper.required(email.value, "Email");
      let isLengthEmail = validateHelper.isLength(
        email.value,
        "Email",
        RULES_VALIDATION.EMAIL_LENGTH.MIN,
        RULES_VALIDATION.EMAIL_LENGTH.MAX
      );

      let requiredPassword = validateHelper.required(password.value, "Mật khẩu");
      let isLengthPassword = validateHelper.isLength(
        password.value,
        "Mật khẩu",
        RULES_VALIDATION.PASSWORD_LENGTH.MIN,
        RULES_VALIDATION.PASSWORD_LENGTH.MAX
      );

      let requiredUsername = validateHelper.required(username.value, "Username");
      let isLengthUsername = validateHelper.isLength(
        username.value,
        "Username",
        RULES_VALIDATION.USERNAME_LENGTH.MIN,
        RULES_VALIDATION.USERNAME_LENGTH.MAX
      );

      validateMessageEmailBeforeSubmit.value = requiredEmail === true ? "" : requiredEmail;
      isPassAllValidate = isPassAllValidate && requiredEmail === true;

      validateMessageEmailBeforeSubmit.value = isLengthEmail === true ? "" : isLengthEmail;
      isPassAllValidate = isPassAllValidate && isLengthEmail === true;

      validateMessagePasswordBeforeSubmit.value = requiredPassword === true ? "" : requiredPassword;
      isPassAllValidate = isPassAllValidate && requiredPassword === true;

      validateMessagePasswordBeforeSubmit.value = isLengthPassword === true ? "" : isLengthPassword;
      isPassAllValidate = isPassAllValidate && isLengthPassword === true;

      validateMessageUsernameBeforeSubmit.value = requiredUsername === true ? "" : requiredUsername;
      isPassAllValidate = isPassAllValidate && requiredUsername === true;

      validateMessageUsernameBeforeSubmit.value = isLengthUsername === true ? "" : isLengthUsername;
      isPassAllValidate = isPassAllValidate && isLengthUsername === true;

      return isPassAllValidate;
    };

    const register = (e: SubmitEvent) => {
      e.preventDefault();
      if (!validateRegisterParams()) {
        errorMessages.value = [];
        return;
      }
      ElLoading.service({ fullscreen: true });
      const userInfo = { username: username.value, email: email.value, password: password.value };
      api.auth.register(
        userInfo,
        (res: any) => {
          ElLoading.service({ fullscreen: true }).close();
          showModalOTPConfirm.value = true;
          ElNotification({
            title: "Success",
            message: "Đăng ký thành công!",
            type: "success",
          });
          navigateTo("/auth/verify-email/" + res.otp_id + '?token_id=' + res.token);
        },
        (err: any) => {
          ElLoading.service({ fullscreen: true }).close();
          errorMessages.value = err.error;
        }
      );
    }

    const loginWithGoogle = async () => {
      ElLoading.service({ fullscreen: true });
      await api.auth.signInCallback(
        { credentials: token.value },
        (res: any) => {
          helperApp.setValueStoreLogin(res);
          ElLoading.service({ fullscreen: true }).close();
          helperApp.redirectToHome(res.user.type);
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
    }

    const handleLoginSuccess = (response: CredentialResponse) => {
      const { credential } = response;
      console.log(credential);
      if (!credential) {
        ElNotification({
          title: "Error",
          message: "Đã xảy ra lỗi!",
          type: "error",
        });

        return ;
      }
      token.value = credential as string;
      loginWithGoogle();
    };
    
    const handleLoginError = () => {
      ElNotification({
        title: "Error",
        message: "Đã xảy ra lỗi!",
        type: "error",
      });
    };

    onMounted(async () => {});

    return {
      username,
      email,
      password,
      errorMessages,
      validateMessageUsernameBeforeSubmit,
      validateMessageEmailBeforeSubmit,
      validateMessagePasswordBeforeSubmit,
      showModalOTPConfirm,
      register,
      handleLoginSuccess,
      handleLoginError,
      
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
