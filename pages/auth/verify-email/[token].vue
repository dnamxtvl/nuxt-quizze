<template>
    <div class="authentication-wrapper authentication-cover authentication-bg">
      <div class="authentication-inner row">
        <!-- /Left Text -->
        <div class="d-none d-lg-flex col-lg-7 p-0">
          <div class="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
            <img
              src="../../../assets/img/illustrations/auth-two-step-illustration-light.png"
              alt="auth-two-steps-cover"
              class="img-fluid my-5 auth-illustration"
              data-app-light-img="illustrations/auth-two-step-illustration-light.png"
              data-app-dark-img="illustrations/auth-two-step-illustration-dark.png" />
          </div>
        </div>
        <!-- /Left Text -->

        <!-- Two Steps Verification -->
        <div class="d-flex col-12 col-lg-5 align-items-center p-4 p-sm-5">
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

            <h3 class="mb-1 fw-bold">Xác thực Email 💬</h3>
            <p class="text-start mb-4">
              Chúng tôi đã gửi mã xác minh đến Email của bạn. Nhập mã từ Email vào ô bên dưới.
              <span class="fw-bold d-block mt-2">******@...com...</span>
            </p>
            <p class="mb-0 fw-semibold">Nhập mã bảo mật gồm 6 chữ số của bạn</p>
              <div class="mb-3">
                <div style="display: flex; flex-direction: row">
                  <Vue3OtpInput
                    ref="otpInput"
                    input-classes="otp-input form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2"
                    :conditionalClass="['one', 'two', 'three', 'four']"
                    separator="-"
                    inputType="number"
                    :num-inputs="6"
                    v-model:value="bindValue"
                    :should-auto-focus="true"
                    :should-focus-order="true"
                    @on-change="handleOnChange"
                    @on-complete="handleOnComplete"
                    :placeholder="['*', '*', '*', '*', '*', '*']"
                  />
                </div>
                <!-- Create a hidden field which is combined by 3 fields above -->
                <input type="hidden" name="otp" />
              </div>
              <button type="button" @click="verifyEmail" class="btn btn-primary d-grid w-100 mb-3">Xác thực tài khoản</button>
              <div class="text-center">
                Không nhận được mã?
                <span class="text-primary cursor-pointer" @click="resendVerifyEmail"> Gửi lại </span>
              </div>
          </div>
        </div>
        <!-- /Two Steps Verification -->
      </div>
    </div>
    </template>
    
<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "~/api/axios";
import { useRoute } from "vue-router";
import Vue3OtpInput from 'vue3-otp-input';
import VOtpInput from "vue3-otp-input";
import { ElLoading, ElNotification } from "element-plus";
import helperApp from "~/utils/helper";

export default defineComponent({
  components: {
    Vue3OtpInput
  },
  setup() {
    const route = useRoute(); 
    const errorMessages = ref<Array<string>>([]);
    const validateMessageEmailBeforeSubmit = ref<string>("");
    const validateMessagePasswordBeforeSubmit = ref<string>("");
    const otp = ref<string>("");
    const otpLength = 6;
    
    const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
    const bindValue = ref("");

    const handleOnComplete = (value: string) => {
      if (otp.value.length == otpLength) {
        otp.value = value;
        verifyEmail();
      }
    };

    const handleOnChange = (value: string) => {
      otp.value = value;
    };

    const clear = () => {
      otpInput.value?.clearInput();
    };

    const fill = (value: string) => {
      console.log(value);
      otpInput.value?.fillInput(value);
    };

    const verifyEmail = async () => {
      if (validateOtp()) {
        ElLoading.service({ fullscreen: true });
        await api.auth.verifyOTPAfterRegister(
          { verify_code: otp.value, otp_id: route.params.token as string, token: route.query.token_id as string },
          (res: any) => {
            ElLoading.service({ fullscreen: true }).close();
            helperApp.setValueStoreLogin(res);
            ElNotification({
              title: "Success",
              message: 'Xác thực email thành công',
              type: "success",
            });
            helperApp.redirectToHome(res.user.type);
          },
          (err: any) => {
            ElLoading.service({ fullscreen: true }).close();
            ElNotification({
              title: "Error",
              message: err.error.shift(),
              type: "error",
            })
          });
      }
    }

    const resendVerifyEmail = () => {
      ElLoading.service({ fullscreen: true });
      api.auth.resendVerifyEmail(
        route.params.token as string,
        (res: any) => {
          ElLoading.service({ fullscreen: true }).close();
          ElNotification({
            title: "Success",
            message: 'Gửi yêu cầu thành công!',
            type: "success",
          })
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

    const validateOtp = () => {
      if (otp.value.length != otpLength) {
        ElNotification({
          title: "Error",
          message: "Mã OTP phải bao gồm 6 kí tự",
          type: "error",
        });

        return false;
      }

      return true;
    }

    onMounted(async () => {});

    return {
      errorMessages,
      validateMessageEmailBeforeSubmit,
      validateMessagePasswordBeforeSubmit,
      otp,
      bindValue,
      otpInput,
      handleOnComplete,
      handleOnChange,
      clear,
      fill,
      verifyEmail,
      resendVerifyEmail,
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

.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input.error {
  border: 1px solid red !important;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
    