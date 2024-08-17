import { GROUP_ROUTE } from "~/constants/application";
import LocalStorageManager from "./localStorage";
import { useMainStore } from "~/store";

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
};
