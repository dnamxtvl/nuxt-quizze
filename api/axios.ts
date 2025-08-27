import AuthService from "~/services/AuthService";
import QuizzeService from "~/services/QuizzeService";
import RoomService from "~/services/RoomService";
import GamerService from "~/services/GamerService";
import NotificationService from "~/services/NotificationService";
import UserService from "~/services/UserService";
import DashboardService from "~/services/DashboardService";
import SettingService from "~/services/SettingService";

const api = {
  auth: new AuthService('/'),
  quizze: new QuizzeService('/'),
  room: new RoomService('/'),
  gamer: new GamerService('/'),
  notification: new NotificationService('/'),
  user: new UserService('/'),
  dashboard: new DashboardService('/'),
  setting: new SettingService('/'),
};

export default api;
