import { GROUP_ROUTE } from "~/constants/application";
import LocalStorageManager from "./localStorage";
import { useMainStore } from "~/store";
import moment from "moment";

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
    ElNotification({ title: 'Error', message: 'Token Expired!', type: 'error', showClose: false });
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
};
