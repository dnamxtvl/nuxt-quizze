export const VN_LOCALE = 'vi';

export const RULES_VALIDATION = {
    EMAIL_FORMAT: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE_FORMAT: /^[0-9-]{12,13}$|^[0-9-]{12}$/,
    ZIP_CODE: /^[0-9]{3}-?[0-9]{4}$/,
    VALID_TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/g,
    USERNAME_LENGTH: {
        MIN: 2,
        MAX: 30
    },
    FULLNAME_LENGTH: {
        MIN: 2,
        MAX: 255
    },
    PASSWORD_LENGTH: {
        MIN: 6,
        MAX: 100
    },
    EMAIL_LENGTH: {
        MIN: 6,
        MAX: 255
    },
    CAPCHA: {
        LENGTH: 6,
        CHARACTER_RANDOM: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        ROTATION_VARIATIONS: [5, 10, 20, 25, -5, -10, -20, -25],
        COEFFICIENT_RANDOM_NUMBER: 36
    },
    DEPARTMENT_NAME_LENGTH: {
        MIN: 6,
        MAX: 255
    },
    DEPARTMENT_ALIAS_LENGTH: {
        MIN: 6,
        MAX: 255
    },
    CODE: {
        LENGTH: 6,
    },
    QUESTION: {
        TITLE: {
            MIN_LENGTH: 6,
            MAX_LENGTH: 255
        },
        MIN_ANSWER: 2,
        MAX_ANSWER: 4
    },
    ROOM: {
        MIN_RANGLE_TIME: 1,
        MAX_RANGLE_TIME: 180,
    },
    FILE: {
        MAX_SIZE_UPLOAD: 5242880,
        MAX_QUESTION: 100,
    }
}

export const EXPIRES_COOKIE_DAY = 90;

export const CALL_AXIOS_TIMEOUT = 300000;

export const BACKEND_URL_DEFAULT = 'http://laravel_new.local/api/';

export const JWT_KEY_ACEESS_TOKEN_NAME = '$2a$12$t538/WFhx.1iL//lRk3kI.9Ymqoyysb76hjXnPoa6b.8ZBx31Fg/i';

export const USER_PROFILE_KEY_NAME = '$2a$12$umoiVcYSuVz.Eja.JvtnbuXBxFdpRcdUs8hLyq7T2DGMrMNSvJzSa';

export const CODE = {
    NETWORK_ERROR: 911,
    SERVER_NOT_WORKING: 'ERR_NETWORK',
    VALIDATE_FAIL: 422,
    AUTHTHENTICATE_FAIL: 401,
}

export const GROUP_ROUTE = {
    USER_CONFIGURATION: {
        PREFIX_PATH: {
            USER: 'user',
            DEPARTMENT: 'department',
        },
        ID_INSTANCE: 'user-configuration'
    },
    EXTENSION_CONFIGURATION: {
        PREFIX_PATH: {
            USER: 'extension',
        },
        ID_INSTANCE: 'extension-configuration'
    },
}
