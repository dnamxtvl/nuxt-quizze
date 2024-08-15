import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class QuizzeService extends BaseService {
    list = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.QUIZZE.LIST, params, success, error);
    }
}
