import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class QuizzeService extends BaseService {
    list = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.QUIZZE.LIST, params, success, error);
    };
    createQuizze = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.QUIZZE.CREATE_QUIZZE, params, success, error);
    };
    deleteQuizze = async (questionId: string, success: any, error: any) => {
        await this.post(API_CONST.QUIZZE.DELETE_QUIZZE + '/' + questionId, {}, success, error);
    };
    listQuestion = async (quizzeId: string, success: any, error: any) => {
        await this.get(API_CONST.QUIZZE.LIST_QUESTION + '/' + quizzeId, {}, success, error);
    };
}
