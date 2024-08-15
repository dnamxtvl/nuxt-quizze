import type { LoginInfo } from '~/constants/type';
import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class AuthService extends BaseService {
    login = async (params: LoginInfo, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGIN, params, success, error);
    }

    logout = async (params: {}, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGOUT, params, success, error);
    }
}
