import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class SettingService extends BaseService {
    getSetting = async (quizId: string, success: any, error: any) => {
        await this.get(API_CONST.SETTING.GET_SETTING + '/' + quizId, {}, success, error);
    };
    updateSetting = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.SETTING.UPDATE_SETTING, params, success, error);
    };
    getLatestUpdate = async (success: any, error: any) => {
        await this.get(API_CONST.SETTING.GET_LATEST_UPDATE, {}, success, error);
    };
}
