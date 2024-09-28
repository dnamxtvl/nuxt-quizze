import helperApp from "~/utils/helper";
import { useMainStore } from "~/store";
import axios from 'axios';
import { CALL_AXIOS_TIMEOUT, CODE } from "~/constants/application";

interface ResponseData {
    data: any;
}

interface ErrorResponse {
    code: number;
    error: string[];
    responseCode: string;
}

export default class BaseService {
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    private processResponse(response: ResponseData) {
        let data = response.data;
        if (data.hasOwnProperty('data')) {
            return data.data;
        }
        return data;
    }

    private logError(e: any, error: (error: ErrorResponse) => void) {
        let errors: string[] = [];
        let errorMessages: string[] = [];
        let codeError: number = CODE.NETWORK_ERROR;

        if (e.code == CODE.SERVER_NOT_WORKING) {
            errors = [helperApp.getErrorMessage(e.message)];
        }

        if (e.response?.hasOwnProperty('status')) {
            if (e.response.status == CODE.AUTHTHENTICATE_FAIL) {
                helperApp.logOutWhenTokenExpired();
                return navigateTo('/admin/login');
            }

            let errorsObject: Record<string, string[]>;
            if (e.response.status === CODE.VALIDATE_FAIL) {
                errorsObject = e.response.data.errors;
                Object.entries(errorsObject).map(([key, value]: [string, string[]]) => {
                    errorMessages.push(value[0]);
                });

                errors = errorMessages;
            } else {
                errors = [helperApp.getErrorMessage(e.response.data.message)];
            }

            codeError = e.response.status;
        }

        error({
            code: codeError,
            error: errors,
            responseCode: typeof e.response?.data?.errors?.code == 'number' ? e.response.data.errors.code : 0,
        });
    }

    async get(endpoint: string, params: Object, success: (json: ResponseData) => void, error: (error: ErrorResponse) => void) {
        try {
            const response = await this.getInstanceAxios().get(this.prefix + endpoint, { params });
            const json = this.processResponse(response);
            success(json);
        } catch (e) {
            this.logError(e, error);
        }
    }

    async post(
        endpoint: string,
        params: Record<string, any> = {},
        success: (json: ResponseData) => void,
        error: (error: ErrorResponse) => void
    ) {
        try {
            const response = await this.getInstanceAxios().post(this.prefix + endpoint, params);
            const json = this.processResponse(response);
            success(json);
        } catch (e) {
            this.logError(e, error);
        }
    }

    async put(
        endpoint: string,
        params: Record<string, any> = {},
        success: (json: ResponseData) => void,
        error: (error: ErrorResponse) => void
    ) {
        try {
            const response = await this.getInstanceAxios().put(this.prefix + endpoint, params);
            const json = this.processResponse(response);
            success(json);
        } catch (e) {
            this.logError(e, error);
        }
    }

    async delete(endpoint: string, data: Record<string, any> = {}, success: (json: any) => void, error: (error: ErrorResponse) => void) {
        try {
            const response = await this.getInstanceAxios().delete(this.prefix + endpoint, { data });
            const json = this.processResponse(response);
            success(json);
        } catch (e) {
            this.logError(e, error);
        }
    }

    async patch(
        endpoint: string,
        params: Record<string, any> = {},
        success: (json: ResponseData) => void,
        error: (error: ErrorResponse) => void
    ) {
        try {
            const response = await this.getInstanceAxios().patch(this.prefix + endpoint, params);
            const json = this.processResponse(response);
            success(json);
        } catch (e) {
            this.logError(e, error);
        }
    }

    urlParse(obj: Record<string, any>, query = false): string {
        const str = [];
        for (let p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] !== null && obj[p] !== undefined && obj[p] !== '') {
                if (obj[p] === true) obj[p] = 1;
                if (obj[p] === false) obj[p] = 0;
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }

        if (query) return '?' + str.join('&') + '&' + query;
        return '?' + str.join('&');
    }

    getInstanceAxios = () => {
        let store = useMainStore();
        const config = useRuntimeConfig();
        const instance = axios.create({
            baseURL: 'http://192.168.0.99/api/',
            headers: { 'Authorization': `Bearer ${store.$state.token}` }
        });

        instance.defaults.headers.post['Content-Type'] = 'application/json';
        instance.defaults.headers.get['Content-Type'] = 'application/json';
        instance.defaults.headers.put['Content-Type'] = 'application/json';
        instance.defaults.headers.delete['Content-Type'] = 'application/json';
        instance.defaults.headers.delete['Content-Type'] = 'application/json';

        instance.defaults.headers.post['Accept'] = 'application/json';
        instance.defaults.headers.get['Accept'] = 'application/json';
        instance.defaults.headers.put['Accept'] = 'application/json';
        instance.defaults.headers.delete['Accept'] = 'application/json';
        instance.defaults.headers.delete['Accept'] = 'application/json';

        return instance;
    }
}
