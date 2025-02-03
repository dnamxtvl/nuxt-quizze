import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class DashboardService extends BaseService {
    index = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.DASHBOARD.INDEX, params, success, error);
    };
}
