import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class UserService extends BaseService {
    list = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.USER.LIST_USER, params, success, error);
    };
    delete = async (userId: string, success: any, error: any) => {
        await this.post(API_CONST.USER.DELETE_USER + '/' + userId, {}, success, error);
    };
    disable = async (userId: string, success: any, error: any) => {
        await this.post(API_CONST.USER.DISABLE_USER + '/' + userId, {}, success, error);
    };
    active = async (userId: string, success: any, error: any) => {
        await this.post(API_CONST.USER.ACTIVE_USER + '/' + userId, {}, success, error);
    };
}