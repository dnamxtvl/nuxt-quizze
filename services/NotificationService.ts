import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class NotificationService extends BaseService {
    list = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.NOTIFICATION.LIST_NOTIFICATION, params, success, error);
    };
}
