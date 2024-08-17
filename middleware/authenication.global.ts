import { useMainStore } from "~/store";

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useMainStore();

    if (!store.$state.isLoggedIn) {
        if (to.path !== '/admin/login' && to.path.includes('/admin')) {
            return navigateTo('/admin/login');
        }
        return;
    }

    if (to.path === '/admin/login' || to.path.includes('/user')) {
        return navigateTo('/admin/dashboard/my-library');
    }
});