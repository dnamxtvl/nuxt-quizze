export enum RoomStatus {
    PREPARE = 0,
    HAPPING = 1,
    FINISHED = 2,
    CANCEL = 3,
    PENDING = 4,
    PREPARE_FINISH = 5,
}

export enum RoomSetting {
    TIME_REPLY = 30,
    TIME_DISPLAY_TOAST = 5000,
}

export enum RoomType {
    KAHOOT = 0,
    HOMEWORK = 1
}

export const ROOM_STATUS_TEXT = {
    0: {
        text: 'Chưa Chạy',
        className: 'bg-warning'
    },
    1: {
        text: 'Đang diễn ra',
        className: 'bg-success'
    },
    2: {
        text: 'Đã kết thúc',
        className: 'bg-danger'
    },
    3: {
        text: 'Cancel',
        className: 'bg-danger'
    },
    4: {
        text: 'Đang tạm nghỉ',
        className: 'bg-warning'
    },
    5: {
        text: 'Sắp kết thúc',
        className: 'bg-primary'
    }
} 