import type { LoginInfo } from '~/constants/type';
import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class AuthService extends BaseService {
    login = async (params: LoginInfo, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGIN, params, success, error);
    };
    logout = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGOUT, params, success, error);
    };
    register = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.REGISTER, params, success, error);
    }
    verifyOTPAfterLogin = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.VERIFY_OTP_AFTER_LOGIN, params, success, error);
    };
    verifyOTPAfterRegister = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.VERiFY_OTP_AFTER_REGISTER, params, success, error);
    };
    resendVerifyEmail = async (otpId: string, success: any, error: any) => {
        await this.get(API_CONST.AUTH.RESEND_VERIFY_EMAIL + '/' + otpId, {}, success, error);
    };
    forgotPassword = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.FORGOT_PASSWORD, params, success, error);
    };
    resetPassword = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.RESET_PASSWORD, params, success, error);
    };
    signInGoogleUrl = async (params: {}, success: any, error: any) => {
        await this.get(API_CONST.AUTH.SIGN_IN_GOOGLE_URL, params, success, error);
    };
    signInCallback = async (params: {}, success: any, error: any) => {
        await this.get(API_CONST.AUTH.SIGN_IN_CALLBACK, params, success, error);
    };
    getProfile = async (userId: string, success: any, error: any) => {
        await this.get(API_CONST.AUTH.GET_PROFILE + '/' + userId, {}, success, error);
    };
    updateProfile = async (userId: string, params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.UPDATE_PROFILE + '/' + userId, params, success, error);
    };
    createUser = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.CREATE_USER, params, success, error);
    };
}
