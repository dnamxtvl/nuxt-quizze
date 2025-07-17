<template>
  <nav
    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
    id="layout-navbar"
  >
    <div
      class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"
    >
      <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
        <i class="ti ti-menu-2 ti-sm"></i>
      </a>
    </div>
    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <!-- Search -->
      <div class="navbar-nav align-items-center">
        <div class="nav-item navbar-search-wrapper mb-0">
          Hello <span class="fw-bold">{{ adminName }}</span
          >!
        </div>
      </div>
      <!-- /Search -->
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <!-- Notification -->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link me-ó">
            <i class="ti ti-bell ti-md"></i>
            <span class="badge bg-danger rounded-pill badge-notifications">{{
              totalUnreadNotify
            }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu v-if="listNotify.length == 0">
              <span
                class="dropdown-notifications-list mb-0 m-4"
                v-if="listNotify.length == 0"
                >Chưa có thông báo!</span
              >
            </el-dropdown-menu>
            <el-dropdown-menu v-if="listNotify.length > 0">
              <li
                class="dropdown-notifications-list scrollable-container"
                v-for="(item, index) in listNotify"
                :key="index"
              >
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item list-group-item-action dropdown-notifications-item"
                    v-if="item.link == null"
                  >
                    <div class="d-flex">
                      <div class="flex-shrink-0 me-3">
                        <div class="avatar">
                          <img
                            :src="
                              item.avatar_notify ??
                              'http://www.localplaner.de/img/6-small.c9b47a98.png'
                            "
                            alt
                            class="h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ item.title }} 🎉</h6>
                        <p class="mb-0">{{ item.content }}</p>
                        <small class="text-muted">{{
                          getRangeTimeCreate(item.created_at)
                        }}</small>
                      </div>
                      <div class="flex-shrink-0 dropdown-notifications-actions">
                        <a
                          href="javascript:void(0)"
                          class="dropdown-notifications-read"
                          v-if="item.is_read == 0"
                          ><span class="badge badge-dot"></span
                        ></a>
                        <a @click="deleteNotify(item.id)"
                          href="javascript:void(0)"
                          class="dropdown-notifications-archive"
                          ><span class="ti ti-x"></span
                        ></a>
                      </div>
                    </div>
                  </li>
                  <li
                    class="list-group-item list-group-item-action dropdown-notifications-item"
                    v-if="item.link != null"
                  >
                    <nuxt-link
                      :to="item.link + '?notification_id=' + item.id"
                      class="dropdown-notifications-item"
                    >
                      <div class="d-flex">
                        <div class="flex-shrink-0 me-3">
                          <div class="avatar">
                            <img
                              :src="
                                item.avatar_notify ??
                                'http://www.localplaner.de/img/6-small.c9b47a98.png'
                              "
                              alt
                              class="h-auto rounded-circle"
                            />
                          </div>
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="mb-1">{{ item.title }} 🎉</h6>
                          <p class="mb-0">{{ item.content }}</p>
                          <small class="text-muted">{{
                            getRangeTimeCreate(item.created_at)
                          }}</small>
                        </div>
                        <div class="flex-shrink-0 dropdown-notifications-actions">
                          <a
                            href="javascript:void(0)"
                            class="dropdown-notifications-read"
                            v-if="item.is_read == 0"
                            ><span class="badge badge-dot"></span
                          ></a>
                          <a @click="deleteNotify(item.id)"
                            href="javascript:void(0)"
                            class="dropdown-notifications-archive"
                            ><span class="ti ti-x"></span
                          ></a>
                        </div>
                      </div>
                    </nuxt-link>
                  </li>
                </ul>
              </li>
              <li
                class="d-flex justify-content-center list-group-item list-group-item-action dropdown-notifications-item"
                v-if="countLoadMore == firstPage"
              >
                <span
                  @click="getListNotify"
                  class="text-center text-primary cursor-pointer"
                  v-if="defaultPerPage <= listNotify.length"
                  >Xem thêm</span
                >
              </li>
              <li
                class="d-flex justify-content-center list-group-item list-group-item-action dropdown-notifications-item"
                v-else
              >
                <span
                  v-if="!disabledLoadMore"
                  @click="getListNotify"
                  class="text-center text-primary cursor-pointer"
                  >Xem thêm</span
                >
              </li>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!--/ Notification -->
        <!-- User -->
        <el-dropdown placement="bottom">
          <div class="avatar avatar-online ms-3">
            <img
              :src="avatar ? avatar : '/img/avatars/14.png'"
              alt
              class="h-auto rounded-circle"
            />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <nuxt-link :to="'/admin/account/' + authId">
                <el-dropdown-item>
                  <RiEyeCloseFill size="18px" class="me-1" /><span class="mt-1">
                    Profile</span
                  >
                </el-dropdown-item>
              </nuxt-link>
              <el-dropdown-item @click="logout">
                <RiLogoutCircleFill size="18px" class="me-1" />
                Đăng xuất
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </ul>
    </div>

    <!-- Search Small Screens -->
    <div class="navbar-search-wrapper search-input-wrapper d-none">
      <input
        type="text"
        class="form-control search-input container-xxl border-0"
        placeholder="Search..."
        aria-label="Search..."
      />
      <i class="ti ti-x ti-sm search-toggler cursor-pointer"></i>
    </div>
  </nav>
</template>
<script lang="ts">
import { RiUser2Line, RiLogoutCircleFill, RiEyeCloseFill } from "@remixicon/vue";
import api from "~/api/axios";
import { ElLoading, ElNotification } from "element-plus";
import CookieManager from "~/utils/cookies";
import LocalStorageManager from "~/utils/localStorage";
import { JWT_KEY_ACEESS_TOKEN_NAME } from "~/constants/application";
import { useMainStore } from "~/store";
import type { ErrorResponse } from "~/constants/type";
import helperApp from "~/utils/helper";

interface ItemNotify {
  id: string;
  title: string;
  content: string;
  avatar_notify?: string;
  type: number;
  user_id: string;
  link: string;
  is_read: number;
  created_at: string;
}

export default defineComponent({
  name: "AdminDashboardNavSearch",
  components: {
    RiUser2Line,
    RiLogoutCircleFill,
    RiEyeCloseFill,
  },

  setup() {
    const store = useMainStore();
    const adminName = store.$state.user?.name;
    const avatar = ref<string | null>(store.$state.user?.avatar);
    const authId = ref<string>(store.$state.user?.id as string);
    const currentSkipNotify = ref<number>(0);
    const listNotify = ref<ItemNotify[]>([]);
    const totalUnreadNotify = ref<number>(0);
    const defaultPerPage = ref<number>(5);
    const countLoadMore = ref<number>(0);
    const firstPage = ref<number>(1);
    const disabledLoadMore = ref<boolean>(false);

    const logout = async () => {
      ElLoading.service({ fullscreen: true });
      await api.auth.logout(
        {},
        (res: any) => {
          ElLoading.service({ fullscreen: true }).close();
          notifySuccessAndRemoveTokenJwt();
          return navigateTo("/admin/login");
        },
        (err: any) => {
          ElLoading.service({ fullscreen: true }).close();
          ElNotification({
            title: "Error",
            message: err.error.shift(),
            type: "error",
          });
          return navigateTo("admin/login");
        }
      );
    };


    const notifySuccessAndRemoveTokenJwt = () => {
      ElNotification({ title: "Success", message: "Đăng xuất thành công!", type: "success", showClose: false });
      CookieManager.removeCookie(JWT_KEY_ACEESS_TOKEN_NAME);
      LocalStorageManager.setItemWithKey("isLoggedIn", false);
      store.logout(store.$state);
    };

    const getListNotify = async () => {
      await api.notification.list(
        {
          latest_notify_id:
            listNotify.value.length > 0
              ? listNotify.value[listNotify.value.length - 1].id
              : "",
        },
        (res: any) => {
          countLoadMore.value++;
          totalUnreadNotify.value = res.count_unread;
          if (res.list_notify.length == 0) {
            disabledLoadMore.value = true;
          } else {
            if (res.list_notify.length < defaultPerPage.value) {
              disabledLoadMore.value = true;
            }
            listNotify.value = [...listNotify.value, ...res.list_notify];
          }
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    };

    const getRangeTimeCreate = (time: string) => {
      return helperApp.calculateTimeAgo(time);
    };

    const deleteNotify = async (id: string) => {
      await api.notification.deleteNotify(
        id,
        (res: any) => {
          let notify = listNotify.value.find((item) => item.id == id);
          listNotify.value = listNotify.value.filter((item) => item.id != id);
          if (notify && notify.is_read == 0) {
            totalUnreadNotify.value--;
          }
        },
        (err: ErrorResponse) => {
          ElNotification({ title: "Error", message: err.error.shift(), type: "error" });
        }
      );
    }

    onMounted(async () => {
      const { $echo }: any = useNuxtApp();
      $echo
        .private("admin.share-quiz." + store.$state.user?.id)
        .listen("ShareQuizEvent", (e: any) => {
          totalUnreadNotify.value++;
          listNotify.value.unshift({
            id: e.notifyId,
            title: e.title,
            content: e.content,
            avatar_notify: e.avatarNotify ?? null,
            type: e.type ?? 0,
            user_id: e.userId,
            link: e.link,
            is_read: 0,
            created_at: e.createdAt,
          });
          ElNotification({
            type: "success",
            title: "Thông báo",
            message: e.content,
            duration: 0,
            position: "bottom-right",
            onClick() {
              return navigateTo(e.link + '?notification_id=' + e.notifyId, {
                external: true,
              });
            },
          });

          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              const notification = new Notification(e.title, {
                body: e.content,
                icon: e.avatarNotify ?? '/img/avatars/14.png',
              });
              notification.onclick = () => {
                window.open(e.link + '?notification_id=' + e.notifyId, '_blank');
              };
            }
          });
        });

      const { $bus }: any = useNuxtApp();
      $bus.$on('clearNotify', (data: {notifyId: string}) => {
        if (data.notifyId) {
          let notify = listNotify.value.find((item: ItemNotify) => item.id === data.notifyId);
          if (notify) {
            listNotify.value = listNotify.value.filter((item: ItemNotify) => item.id !== data.notifyId);
            if (notify.is_read == 0) {
              totalUnreadNotify.value = totalUnreadNotify.value > 0 ? totalUnreadNotify.value - 1 : 0;
            }
          }
        }
      });

      $bus.$on('changeAvatar', (data: {avatar: string | null}) => {
        avatar.value = data.avatar;
      });
      
      await getListNotify();
    });

    return {
      logout,
      adminName,
      currentSkipNotify,
      totalUnreadNotify,
      listNotify,
      getRangeTimeCreate,
      defaultPerPage,
      getListNotify,
      countLoadMore,
      firstPage,
      disabledLoadMore,
      deleteNotify,
      authId,
      avatar,
    };
  },
});
</script>
<style scoped>
.dropdown-notifications-list {
  min-width: 500px;
}
</style>
