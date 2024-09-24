import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class RoomService extends BaseService {
    create = async (id: string, params: Object ,success: any, error: any) => {
        await this.post(API_CONST.ROOM.CREATE + '/' + id, params, success, error);
    };
    checkValidRoom = async (id: string, success: any, error: any) => {
        await this.get(API_CONST.ROOM.CHECK_VALID + '/' + id, {}, success, error);
    };
    verifyCode = async (code: number, success: any, error: any) => {
        await this.post(API_CONST.ROOM.VERIFY_CODE + '/', {code: code}, success, error);
    };
    listQuestionOfRoom = async (id: string, success: any, error: any) => {
        await this.get(API_CONST.ROOM.LIST_QUESTION_OF_ROOM + '/' + id, {}, success, error);
    };
    startGame = async (id: string, success: any, error: any) => {
        await this.post(API_CONST.ROOM.START, {room_id: id}, success, error);
    };
    nextQuestion = async (params: Object, success: any, error: any) => {
        await this.post(API_CONST.ROOM.NEXT_QUESTION, params,success, error);
    };
    adminEndGame = async (roomId: string, success: any, error: any) => {
        await this.post(API_CONST.ROOM.ADMIN_END_GAME + '/' + roomId, {}, success, error);
    };
    getDetailRoom = async (roomId: string, success: any, error: any) => {
        await this.get(API_CONST.ROOM.GET_DETAIL_ROOM + '/' + roomId, {}, success, error);
    };
    getListRoomReport = async (params: Object, success: any, error: any) => {
        await this.get(API_CONST.ROOM.GET_LIST_ROOM_REPORT, params, success, error);
    };
}
