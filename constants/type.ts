export interface LoginInfo {
    email: string;
    password: string;
}

export interface UserInfo {
    email: string;
    name: string;
    type: number;
}

export interface ItemQuizze {
    id: string;
    title: string;
    category_id: number;
    user_id: string;
    code: string;
    questions_count: number;
    rooms_count: number;
    category?: {
        id: number;
        name: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    },
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface GamerAnswer {
    id: number;
    answer_id: number;
    answer_in_time: number;
    gamer_id: string;
    question_id: string;
    room_id: string;
    score: number;
    created_at: string;
    updated_at: string;
}

export interface Answer {
    id: number;
    answer: string;
    is_correct: boolean;
    created_at: string;
}

export interface ItemQuestion {
    id: string;
    title: string;
    quizze_id: string;
    answers: Array<Answer>;
    created_at: string;
}

export interface GamerResult {
    id: string;
    name: string;
    gamer_answers: Array<GamerAnswer> | [];
    gamer_answers_sum_score: number;
    display_meme: boolean;
    ip_address: string;  
    created_at: string;
    updated_at: string;
}

export interface GamerToken {
    id: string;
    token: string;
    submit_at: string|null;
    created_at: string
}

export interface Quizz {
    id: string;
    title: string;
    code: string;
    category_id: number;
    created_at: string
    updated_at: string
}

export interface ErrorResponse {
    code: number;
    error: string[];
    responseCode: number;
}

export interface Category {
    id: number;
    name: string,
    created_at: string
}