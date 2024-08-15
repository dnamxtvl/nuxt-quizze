import AuthService from "~/services/AuthService";
import QuizzeService from "~/services/QuizzeService";
import RoomService from "~/services/RoomService";

const api = {
  auth: new AuthService('/'),
  quizze: new QuizzeService('/'),
  room: new RoomService('/'),
};

export default api;
