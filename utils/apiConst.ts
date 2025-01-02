const API_CONST = {
    AUTH: {
        LOGIN: 'admin/login',
        LOGOUT: 'admin/logout',
        VERIFY_OTP_AFTER_LOGIN: 'auth/email/verify-login',
    },
    QUIZZE: {
        LIST: 'admin/quizzes/list',
        CREATE_QUIZZE: 'admin/quizzes/create',
        DELETE_QUIZZE: 'admin/quizzes/delete',
        LIST_QUESTION: 'admin/quizzes/list-question',
        UPDATE_QUESTION: 'admin/quizzes/update-question',
        CREATE_QUESTION: 'admin/quizzes/create-question',
        DELETE_QUESTION: 'admin/quizzes/delete-question',
        SHARE_QUIZZE: 'admin/quizzes/share',
        DETAIL_SHARE_QUIZZE: 'admin/quizzes/detail-share',
        ACCEPT_SHARE_QUIZZE: 'admin/quizzes/accept-share',
        REJECT_SHARE_QUIZZE: 'admin/quizzes/reject-share',
        SEARCH_QUIZZE: 'admin/quizzes/search',
    },
    CATEGORY: {
        LIST_CATEGORY: 'admin/category/list',
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
        GET_QUANTITY_GAMER_ANSWER: '/user/gamer/get_quantity_gamer_answer'
    },
    FRONT_END: {
        USER_GAME: '/user/join/game',
        ADMIN_GAME: '/admin/dashboard/activity',
        HOMEWORK: '/user/join/homework',
        REPORT_DETAIL: '/admin/dashboard/reports',
        DETAIL_QUIZ: '/admin/dashboard/my-library',
        USER_DETAIL: '/admin/dashboard/users/detail',
    },
    NOTIFICATION: {
        LIST_NOTIFICATION: 'admin/notification/list',
        DELETE_NOTIFICATION: 'admin/notification/delete',
    },
    USER: {
        LIST_USER: 'admin/user/search',
        DELETE_USER: 'admin/user/delete',
        DISABLE_USER: 'admin/user/disable',
        ACTIVE_USER: 'admin/user/active',
    }
};

export default API_CONST;
