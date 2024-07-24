import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class AuthService extends BaseService {
    login = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGIN, params, success, error);
    }

    logout = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.AUTH.LOGOUT, params, success, error);
    }
}
