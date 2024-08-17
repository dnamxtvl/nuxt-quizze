import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class GamerService extends BaseService {
    createSetting = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.GAMER.CREATE_SETTING, params, success, error);
    };
    submitAnswer = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.GAMER.SUBMIT_ANSWER, params, success, error);
    };
}
