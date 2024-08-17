const API_CONST = {
    AUTH: {
        LOGIN: 'admin/login',
        LOGOUT: 'admin/logout',
    },
    QUIZZE: {
        LIST: 'admin/quizzes/list',
    },
    ROOM: {
        CREATE: 'admin/room/create',
        CHECK_VALID: 'admin/room/check-valid',
        VERIFY_CODE: 'user/room/verify-code',
        LIST_QUESTION_OF_ROOM: 'user/room/list-question',
        START: 'admin/room/start',
    },
    GAMER: {
        CREATE_SETTING: 'user/gamer/create-setting',
        SUBMIT_ANSWER: 'user/gamer/submit-answer',
    }
};

export default API_CONST;
