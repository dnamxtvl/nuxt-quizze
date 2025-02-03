import { USER_TYPE_ENUM } from "~/constants/user";
import { useMainStore } from "~/store";

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useMainStore();

    if (!store.$state.isLoggedIn) {
        if (to.path !== '/admin/login' && to.path.includes('/admin')) {
            return navigateTo('/admin/login');
        }
        return;
    }

    if (to.path === '/admin/login' || to.path.includes('/user') || to.path.includes('/auth')) {
        if (store.$state.user.type === USER_TYPE_ENUM.USER) {
            return navigateTo('/admin/dashboard/my-library');
        }

        return navigateTo("/admin/dashboard");
    }
});