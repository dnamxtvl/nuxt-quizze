import { defineStore } from 'pinia';
import LocalStorageManager from '~/utils/localStorage';
import { USER_PROFILE_KEY_NAME } from '~/constants/application';
import { JWT_KEY_ACEESS_TOKEN_NAME } from '~/constants/application';
import CookieManager from '~/utils/cookies';
import type { UserInfo } from '~/constants/type';

export const useMainStore = defineStore({
  id: 'app',
  state: () => ({
    isLoggedIn: LocalStorageManager.getItemWithKey('isLoggedIn') ?? false,
    user: LocalStorageManager.getItemWithKey(USER_PROFILE_KEY_NAME) ?? null,
    token: CookieManager.getCookie(JWT_KEY_ACEESS_TOKEN_NAME) ?? null,
    gamerId: CookieManager.getCookie('gamerId'+ JWT_KEY_ACEESS_TOKEN_NAME) ?? null,
    isOnline: LocalStorageManager.getItemWithKey('isOnline') ?? true,
  }),
  getters: {
    isLoggedIn: (state: any) => state.isLoggedIn,
    user: (state: any) => state.user,
    token: (state: any) => state.token,
    gamerId: (state: any) => state.gamerId,
    isOnline: (state: any) => state.isOnline,
  },
  actions: {
    login(state: any, user: UserInfo, token: string){
      state.isLoggedIn = true
      state.user = user
      state.token = token
    },

    logout(state: any) {
      state.isLoggedIn = false
      state.user = null
      state.token = null;
    },

    saveGamerId(state: any, id: string) {
      state.gamerId = id
    },

    changeStateOnline(state: any, isOnline: boolean) {
      state.isOnline = isOnline
    }
  },
});
