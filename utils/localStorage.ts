import { EXPIRES_COOKIE_DAY } from "~/constants/application";

export default class LocalStorageManager {
  static setItemWithKey = async (key: string, value: any) => {
    const now = new Date();
    const dayExpires = EXPIRES_COOKIE_DAY;
    const minutes = dayExpires * 24 * 60;
    const item = {
      value: value,
      expiry: now.getTime() + minutes * 60 * 1000,
    };
    try {
      await new Promise((resolve) => {
        localStorage.setItem(key, JSON.stringify(item));
        resolve();
      });
    } catch (error) {
      console.error("Error setting item in localStorage:", error);
    }
  }

  static getItemWithKey = (key: string): any | null => {
    const itemString = localStorage.getItem(key);

    if (!itemString) {
      return null;
    }

    try {
      const item = JSON.parse(itemString);
      const now = new Date().getTime();

      if (!item || now > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error("Error get item in localStorage:", error);
      return null;
    }
  };

  static removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error delete item in localStorage:", error);
      return;
    }
  }
}