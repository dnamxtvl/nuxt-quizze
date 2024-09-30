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
    updateQuestion = async (questionId: string, params: Object, success: any, error: any) => {
        await this.put(API_CONST.QUIZZE.UPDATE_QUESTION + '/' + questionId, params, success, error);
    };
    createQuestion = async (quizzeId: string, params: Object, success: any, error: any) => {
        await this.post(API_CONST.QUIZZE.CREATE_QUESTION + '/' + quizzeId, params, success, error);
    };
    deleteQuestion = async (questionId: string, success: any, error: any) => {
        await this.post(API_CONST.QUIZZE.DELETE_QUESTION + '/' + questionId, {}, success, error);
    };
    shareQuiz = async (quizzeId: string, params: Object,success: any, error: any) => {
        await this.post(API_CONST.QUIZZE.SHARE_QUIZZE + '/' + quizzeId, params, success, error);
    };
    detailShareQuiz = async (token: string, notificationId: string ,success: any, error: any) => {
        let urlDetail = API_CONST.QUIZZE.DETAIL_SHARE_QUIZZE + '/' + token;
        if (notificationId.length > 0) {
            urlDetail += '?notification_id=' + notificationId;
        }
        await this.get(urlDetail, {}, success, error);
    };
    acceptShareQuiz = async (token: string, notificationId: string ,success: any, error: any) => {
        let urlDetail = API_CONST.QUIZZE.ACCEPT_SHARE_QUIZZE + '/' + token;
        if (notificationId.length > 0) {
            urlDetail += '?notification_id=' + notificationId;
        }
        await this.post(urlDetail, {}, success, error);
    };
    rejectShareQuiz = async (token: string, notificationId: string ,success: any, error: any) => {
        let urlDetail = API_CONST.QUIZZE.REJECT_SHARE_QUIZZE + '/' + token;
        if (notificationId.length > 0) {
            urlDetail += '?notification_id=' + notificationId;
        }
        await this.post(urlDetail, {}, success, error);
    };
    listCategory = async (success: any, error: any) => {
        await this.get(API_CONST.CATEGORY.LIST_CATEGORY, {}, success, error);
    };
}
