<template>
    <div class="authentication-wrapper authentication-cover authentication-bg">
        <div class="authentication-inner row">
            <!-- /Left Text -->
            <div class="d-none d-lg-flex col-lg-7 p-0">
              <div class="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
                <img
                  src="../../../assets/img/illustrations/auth-forgot-password-illustration-light.png"
                  alt="auth-forgot-password-cover"
                  class="img-fluid my-5 auth-illustration"
                  data-app-light-img="illustrations/auth-forgot-password-illustration-light.png"
                  data-app-dark-img="illustrations/auth-forgot-password-illustration-dark.png" />
              </div>
            </div>
            <!-- /Left Text -->
    
            <!-- Forgot Password -->
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
                <h3 class="mb-1 fw-bold">Quên mật khẩu? 🔒</h3>
                <p class="mb-4">Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu</p>
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
                <div class="mb-0">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="email"
                      id="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      autofocus />
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
                <button class="btn btn-primary d-grid w-100 mt-3 mb-3" @click="forgotPassword">Gửi link reset</button>
                <div class="text-center">
                    <nuxt-link to="/admin/login" class="d-flex align-items-center justify-content-center">
                        <i class="ti ti-chevron-left scaleX-n1-rtl"></i>
                        Trở về đăng nhập
                    </nuxt-link>
                </div>
              </div>
            </div>
            <!-- /Forgot Password -->
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
    const email = ref<string>("");
    const errorMessages = ref<Array<string>>([]);
    const validateMessageEmailBeforeSubmit = ref<string>("");

    const forgotPassword = () => {
        if (!validateEmail()) {
            return ;
        }

        ElLoading.service({ fullscreen: true });
        api.auth.forgotPassword(
            { email: email.value},
            (res: any) => {
                ElLoading.service({ fullscreen: true }).close();
                ElNotification({
                    title: "Success",
                    message: 'Chúng tôi đã gửi link reset mật khẩu đến email của bạn!',
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
                })
            }
        )
    }

    const validateEmail = () => {
        const validateHelper = useValidator();
        let isPassAllValidate = true;
        let requiredEmail = validateHelper.required(email.value, "Email");
        let isLengthEmail = validateHelper.isLength(
            email.value,
            "Email",
            RULES_VALIDATION.EMAIL_LENGTH.MIN,
            RULES_VALIDATION.EMAIL_LENGTH.MAX
        );
        let isInvalidEmail = validateHelper.isInvalidEmail(email.value, true);
        
        validateMessageEmailBeforeSubmit.value =
            requiredEmail === true ? "" : requiredEmail;
        isPassAllValidate = isPassAllValidate && requiredEmail === true;

        validateMessageEmailBeforeSubmit.value =
            isLengthEmail === true ? "" : isLengthEmail;
        isPassAllValidate = isPassAllValidate && isLengthEmail === true;

        if (isPassAllValidate) {
            validateMessageEmailBeforeSubmit.value =
            isInvalidEmail === true ? "" : 'Email không hợp lệ';
            isPassAllValidate = isPassAllValidate && isInvalidEmail === true;
        }

        return isPassAllValidate;
    };

    onMounted(async () => {});

    return {
        email,
        errorMessages,
        validateMessageEmailBeforeSubmit,
        forgotPassword,
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

input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
}
</style>
    