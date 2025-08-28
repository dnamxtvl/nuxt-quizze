import { defineStore } from 'pinia';
import LocalStorageManager from '~/utils/localStorage';
import { BG_DEFAULT, MUSIC_DEFAULT, USER_PROFILE_KEY_NAME } from '~/constants/application';
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
    bgSelected: LocalStorageManager.getItemWithKey('bgSelected') ?? {
      name: BG_DEFAULT[0].name,
      link: BG_DEFAULT[0].link
    },
    musicSelected: LocalStorageManager.getItemWithKey('musicSelected') ?? {
      name: MUSIC_DEFAULT[0].name,
      link: MUSIC_DEFAULT[0].link
    },
  }),
  getters: {
    isLoggedIn: (state: any) => state.isLoggedIn,
    user: (state: any) => state.user,
    token: (state: any) => state.token,
    gamerId: (state: any) => state.gamerId,
    isOnline: (state: any) => state.isOnline,
    bgSelected: (state: any) => state.bgSelected,
    musicSelected: (state: any) => state.musicSelected,
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
    },

    changeAvatar(state: any, avatar: string) {
      state.user.avatar = avatar
    },

    changeBgSelected(state: any, bg: { name: string, link: string }) {
      state.bgSelected = bg
    },

    changeMusicSelected(state: any, music: { name: string, link: string }) {
      state.musicSelected = music
    },
  },
});
