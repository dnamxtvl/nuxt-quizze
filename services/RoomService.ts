import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class RoomService extends BaseService {
    create = async (id: string, success: any, error: any) => {
        await this.post(API_CONST.ROOM.CREATE + '/' + id, {}, success, error);
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
}
