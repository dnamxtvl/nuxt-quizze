import { GROUP_ROUTE } from "~/constants/application";
import LocalStorageManager from "./localStorage";
import { useMainStore } from "~/store";
import moment from "moment";
import type { GamerAnswer } from "~/constants/type";
import { USER_TYPE_ENUM } from "~/constants/user";
import {
  JWT_KEY_ACEESS_TOKEN_NAME,
  USER_PROFILE_KEY_NAME,
} from "~/constants/application";
import CookieManager from "~/utils/cookies";

export default class helperApp {
  static getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  static logOutWhenTokenExpired = () => {
    LocalStorageManager.setItemWithKey('isLoggedIn', false);
    let store = useMainStore();
    store.logout(store.$state);
    ElNotification({ title: 'Error', message: 'Phiên đăng nhập hết hạn!', type: 'error', showClose: false });
    ElLoading.service({ fullscreen: true }).close();
  }

  static getForwardGroupRouteWhenRedirect: Object | null = (path: string) => {
    let currentPrefixPath = path.split("/")[1];
    return Object.values(GROUP_ROUTE).find((group) => {
      const prefixPath: Record<string, string> = group.PREFIX_PATH;
      return (
        prefixPath &&
        Object.keys(prefixPath).some(
          (key) => prefixPath[key] === currentPrefixPath
        )
      );
    }) || null;
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
  }

  static calculateTimeAgo = (timestamp: string) => {
    const currentTime = moment();
    const targetTime = moment(timestamp);
    
    const diffYears = currentTime.diff(targetTime, 'years');
    if (diffYears > 0) {
        return `${diffYears} năm trước`;
    }
    
    const diffMonths = currentTime.diff(targetTime, 'months');
    if (diffMonths > 0) {
        return `${diffMonths} tháng trước`;
    }

    const diffWeeks = currentTime.diff(targetTime, 'weeks');
    if (diffWeeks > 0) {
        return `${diffWeeks} tuần trước`;
    }
    
    const diffDays = currentTime.diff(targetTime, 'days');
    if (diffDays > 0) {
        return `${diffDays} ngày trước`;
    }
    
    const diffHours = currentTime.diff(targetTime, 'hours');
    if (diffHours > 0) {
        return `${diffHours} giờ trước`;
    }
    
    const diffMinutes = currentTime.diff(targetTime, 'minutes');

    if (diffMinutes > 0) {
        return `${diffMinutes} phút trước`;
    }

    return `now`;
  }

  static convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  static getColorOfQuestion = (gamerAnswers: Array<GamerAnswer> | [], questionId: string) => {
    if (gamerAnswers.length == 0) {
      return {
          score: 0,
          class: "bg-warning"
      };
    }

    let answer = gamerAnswers.filter((answer: GamerAnswer) => answer.question_id == questionId);

    if (answer.length > 0) {
        if (answer[0].score > 0) {
            return {
                score: answer[0].score,
                class: "bg-success"
            };
        }

        return {
          score: 0,
          class: "bg-danger",
        };
    }
    
    return {
        score: 0,
        class: "bg-warning"
    };
  }

  static redirectToHome = (type: number) => {
    if (type == USER_TYPE_ENUM.USER) {
      return navigateTo("/admin/dashboard/my-library");
    } else {
      return navigateTo("/admin/dashboard");
    }
  };

  static setValueStoreLogin = async (data: any) => {
    let store = useMainStore();
    const userInfo = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      type: data.user.type,
    };
    await LocalStorageManager.setItemWithKey("isLoggedIn", true);
    await CookieManager.setCookie(JWT_KEY_ACEESS_TOKEN_NAME, data.token);
    await LocalStorageManager.setItemWithKey(USER_PROFILE_KEY_NAME, userInfo);
    store.login(store.$state, userInfo, data.token);
  };
};
