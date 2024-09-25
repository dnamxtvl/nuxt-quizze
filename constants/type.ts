export interface LoginInfo {
    email: string;
    password: string;
}

export interface UserInfo {
    email: string;
    name: string;
}

export interface ItemQuizze {
    id: string;
    title: string;
    category_id: number;
    user_id: string;
    questions_count: number;
    rooms_count: number;
    category?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ErrorResponse {
    code: number;
    error: string[];
    responseCode: number;
}