<template>
    <div class="wrapper">
        <div class="logo">
            <img src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-bird-symbols-png-logo-0.png" alt="">
        </div>
        <div class="text-center mt-4 name">
            Hyouban
        </div>
        <div class="valiate-message-error mt-2" v-if="errorMessages.length > 0" v-for="(error, index) in errorMessages">
            <el-alert :title="error" type="error" class="ps-2 pe-2" :closable="false" :key="index"/>
        </div>
        <form class="p-3" @submit="login">
            <div class="form-field d-flex align-items-center">
                <div class="row">
                    <div class="col-12">
                        <input type="text" name="email" v-model="email" placeholder="Email">
                    </div>
                </div>
            </div>
            <div class="valiate-message-error col-12" v-if="validateMessageEmailBeforeSubmit">
                <el-alert :title="validateMessageEmailBeforeSubmit" class="text-center" type="error" :closable="false" />
            </div>
            <div class="form-field d-flex align-items-center mt-3">
                <div class="row">
                    <div class="col-12">
                        <input type="password" name="password" v-model="password" placeholder="Password">
                    </div>
                </div>
            </div>
            <div class="valiate-message-error" v-if="validateMessagePasswordBeforeSubmit">
                <el-alert :title="validateMessagePasswordBeforeSubmit" type="error" :closable="false" />
            </div>
            <button type="submit" class="btn mt-3">Login</button>
        </form>
        <div class="text-center fs-6">
            <a href="#">Forget password?</a> or <a href="#">Sign up</a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "~/server/api/axios";
import { ElLoading } from "element-plus";
import LocalStorageManager from "~/utils/localStorage";
import CookieManager from "~/utils/cookies";
import { JWT_KEY_ACEESS_TOKEN_NAME, USER_PROFILE_KEY_NAME } from "~/constants/application";
import { useMainStore } from "~/store";
import { useValidator } from "#imports";
import { RULES_VALIDATION } from "~/constants/application";

export default defineComponent({
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');
    const errorMessages = ref<Array<string>>([]);
    const validateMessageEmailBeforeSubmit = ref<string>('');
    const validateMessagePasswordBeforeSubmit = ref<string>('');
    const store = useMainStore();

    const login: Function = async (e: SubmitEvent) => {
        e.preventDefault();
        if (!validateLoginInfo()) {
            errorMessages.value = [];
            return ;
        }
        ElLoading.service({ fullscreen: true });
        const userInfo = { email: email.value, password: password.value }

        await api.auth.login(
            userInfo,
            (res: any) => {
                setValueStoreLogin(res);
                ElLoading.service({ fullscreen: true }).close();
                return navigateTo("/admin/dashboard/my-library");
            },
            (err: any) => {
                ElLoading.service({ fullscreen: true }).close();
                errorMessages.value = err.error;
            }
        );
    }

    const setValueStoreLogin = async (data: any) => {
        const userInfo = { email: data.user.email, name: data.user.name };
        await LocalStorageManager.setItemWithKey("isLoggedIn", true);
        await CookieManager.setCookie(JWT_KEY_ACEESS_TOKEN_NAME, data.token);
        await LocalStorageManager.setItemWithKey(
            USER_PROFILE_KEY_NAME,
            userInfo
        );
        store.login(store.$state, userInfo, data.token);
    };

    const validateLoginInfo = () => {
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

        validateMessageEmailBeforeSubmit.value =
            requiredEmail === true ? "" : requiredEmail;
        isPassAllValidate = isPassAllValidate && requiredEmail === true;

        validateMessageEmailBeforeSubmit.value =
            isLengthEmail === true ? "" : isLengthEmail;
        isPassAllValidate = isPassAllValidate && isLengthEmail === true;

        validateMessagePasswordBeforeSubmit.value =
            requiredPassword === true ? "" : requiredPassword;
        isPassAllValidate = isPassAllValidate && requiredPassword === true;

        validateMessagePasswordBeforeSubmit.value =
            isLengthPassword === true ? "" : isLengthPassword;
        isPassAllValidate = isPassAllValidate && isLengthPassword === true;

        return isPassAllValidate;
    }

    onMounted(async () => {
      
    });

    return {
        email,
        password,
        login,
        errorMessages,
        validateMessageEmailBeforeSubmit,
        validateMessagePasswordBeforeSubmit,
    }
  }
})
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

.wrapper {
    max-width: 350px;
    min-height: 500px;
    margin: 80px auto;
    padding: 40px 30px 30px 30px;
    background-color: #ecf0f3;
    border-radius: 15px;
    box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}

.logo {
    width: 80px;
    margin: auto;
}

.logo img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0px 0px 3px #5f5f5f,
        0px 0px 0px 5px #ecf0f3,
        8px 8px 15px #a7aaa7,
        -8px -8px 15px #fff;
}

.wrapper .name {
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 1.3px;
    padding-left: 10px;
    color: #555;
}

.wrapper .form-field input {
    width: 100%;
    display: block;
    border: none;
    outline: none;
    background: none;
    font-size: 1.2rem;
    color: #666;
    padding: 10px 15px 10px 10px;
    /* border: 1px solid red; */
}

.wrapper .form-field {
    padding-left: 10px;
    border-radius: 20px;
    box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}

.wrapper .form-field .fas {
    color: #555;
}

.wrapper .btn {
    box-shadow: none;
    width: 100%;
    height: 40px;
    background-color: #03A9F4;
    color: #fff;
    border-radius: 25px;
    box-shadow: 3px 3px 3px #b1b1b1,
        -3px -3px 3px #fff;
    letter-spacing: 1.3px;
}

.wrapper .btn:hover {
    background-color: #039BE5;
}

.wrapper a {
    text-decoration: none;
    font-size: 0.8rem;
    color: #03A9F4;
}

.wrapper a:hover {
    color: #039BE5;
}

.el-alert--error.is-light {
    border-radius: 1.25rem;
    display: flex;
    justify-content: center;
}

@media(max-width: 380px) {
    .wrapper {
        margin: 30px 20px;
        padding: 40px 15px 15px 15px;
    }
}
</style>