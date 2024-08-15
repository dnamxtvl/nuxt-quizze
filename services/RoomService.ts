import BaseService from './BaseService';
import API_CONST from '~/utils/apiConst';

export default class RoomService extends BaseService {
    create = async (id: string, success: any, error: any) => {
        await this.post(API_CONST.ROOM.CREATE + '/' + id, {}, success, error);
    };
    checkValidRoom = async (id: string, success: any, error: any) => {
        await this.get(API_CONST.ROOM.CHECK_VALID + '/' + id, {}, success, error);
    };
}
