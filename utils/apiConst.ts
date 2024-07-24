const API_CONST = {
    AUTH: {
        LOGIN: 'login',
        LOGOUT: 'logout',
    },
    EXTENSION: {
        LIST: 'extension/index',
        DEACTIVE_USER: 'extension/delete-user-on-extension',
        CREATE: 'extension/create-extension',
        UPDATE: 'extension/update-extension',
        TOGGLE_ACTIVE: 'extension/toggle-active-extension'
    },
    UNREVOKE_EXTENSION: {
        LIST: 'unrevoke-extension-log/get-by-extension-id'
    },
    DEPARTMENT: {
        LIST: 'department/list'
    }
};

export default API_CONST;
