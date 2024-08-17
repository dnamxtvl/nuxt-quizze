import AuthService from "~/services/AuthService";
import QuizzeService from "~/services/QuizzeService";
import RoomService from "~/services/RoomService";
import GamerService from "../../services/GamerService";

const api = {
  auth: new AuthService('/'),
  quizze: new QuizzeService('/'),
  room: new RoomService('/'),
  gamer: new GamerService('/'),
};

export default api;
