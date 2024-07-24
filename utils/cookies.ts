import { EXPIRES_COOKIE_DAY } from "~/constants/application";

export default class CookieManager {
    static getCookie = (cookieName: string) => {
      const name = cookieName + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');
      
      for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      
      return null;
    }
  
    static setCookie = async (cookieName: string, cookieValue: any) => {
      const date = new Date();
      const expirationDays = EXPIRES_COOKIE_DAY;
      date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
    }
  
    static removeCookie = (cookieName: string) => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}
