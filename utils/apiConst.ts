const API_CONST = {
    AUTH: {
        LOGIN: 'admin/login',
        LOGOUT: 'admin/logout',
    },
    QUIZZE: {
        LIST: 'admin/quizzes/list',
        CREATE_QUIZZE: 'admin/quizzes/create',
        DELETE_QUIZZE: 'admin/quizzes/delete',
        LIST_QUESTION: 'admin/quizzes/list-question',
    },
    ROOM: {
        CREATE: 'admin/room/create',
        CHECK_VALID: 'admin/room/check-valid',
        VERIFY_CODE: 'user/room/verify-code',
        LIST_QUESTION_OF_ROOM: 'user/room/list-question',
        START: 'admin/room/start',
        NEXT_QUESTION: 'admin/room/next-question',
        ADMIN_END_GAME: 'admin/room/end-game',
        GET_DETAIL_ROOM: 'admin/room/detail',
        GET_LIST_ROOM_REPORT: 'admin/room/list-report',
        DELETE_ROOM_REPORT: 'admin/room/delete-report',
    },
    GAMER: {
        CREATE_SETTING: 'user/gamer/create-setting',
        SUBMIT_ANSWER: 'user/gamer/submit-answer',
        OUT_GAME: 'user/gamer/out-game',
        SUBMIT_HOMEWORK: 'user/gamer/submit-homework',
    },
    FRONT_END: {
        USER_GAME: '/user/join/game',
        ADMIN_GAME: '/admin/dashboard/activity',
        HOMEWORK: '/user/join/homework',
        REPORT_DETAIL: '/admin/dashboard/reports',
        DETAIL_QUIZ: '/admin/dashboard/my-library',
    }
};

export default API_CONST;
