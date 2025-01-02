<template>
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
        <div class="app-brand demo">
            <a href="index.html" class="app-brand-link">
                <span class="app-brand-logo demo">
                    <svg width="50" height="60" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                            fill="#7367F0" />
                        <path opacity="0.06" fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z" fill="#161616" />
                        <path opacity="0.06" fill-rule="evenodd" clip-rule="evenodd"
                            d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z" fill="#161616" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                            fill="#7367F0" />
                    </svg>
                </span>
                <span class="app-brand-text demo menu-text fw-bold">Hyouban</span>
            </a>

            <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
                <i class="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                <i class="ti ti-x d-block d-xl-none ti-sm align-middle"></i>
            </a>
        </div>

        <div class="menu-inner-shadow"></div>
        <div class="row menu-item d-flex justify-content-center mb-3 mt-2 ms-2 me-2">
            <nuxt-link to="/admin/create/quizz" class="btn btn-primary text-white col-md-12" exact-active-class="active"><RiAddCircleFill size="18" class-name="me-1" />Tạo mới</nuxt-link>
        </div>
        <ul class="menu-inner py-1">
            <!-- Dashboards -->
            <li class="menu-item active open">
                <a href="javascript:void(0);" class="menu-link menu-toggle">
                    <i class="menu-icon tf-icons ti ti-smart-home"></i>
                    <div data-i18n="Dashboards">Dashboards</div>
                    <div class="badge bg-label-primary rounded-pill ms-auto">2</div>
                </a>
                <ul class="menu-sub">
                    <li class="menu-item">
                        <nuxt-link to="/admin/dashboard/quizzes" :class="'menu-link ' + (useRoute().path.includes(detailQuizzRoutePath) ? 'active' : '')" exact-active-class="active">
                            <div data-i18n="CRM">Bộ câu hỏi</div>
                        </nuxt-link>
                    </li>
                    <li class="menu-item">
                        <nuxt-link to="/admin/dashboard/my-library" :class="'menu-link ' + (useRoute().path.includes(detailQuizzRoutePath) ? 'active' : '')" exact-active-class="active">
                            <div data-i18n="CRM">Thư viện của tôi</div>
                        </nuxt-link>
                    </li>
                    <li class="menu-item">
                        <nuxt-link to="/admin/dashboard/reports" :class="'menu-link ' + (useRoute().path.includes(detailReportRoutePath) ? 'active' : '')" exact-active-class="active">
                            <div data-i18n="CRM">Báo cáo</div>
                        </nuxt-link>
                    </li>
                    <li class="menu-item">
                        <nuxt-link to="/admin/dashboard/list-user" :class="'menu-link ' + (useRoute().path.includes(userDetailRoutePath) ? 'active' : '')" exact-active-class="active">
                            <div data-i18n="CRM">Danh sách user</div>
                        </nuxt-link>
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>
<script lang="ts">
import { RiAddCircleFill } from '@remixicon/vue';
import { useRoute } from "vue-router";
import API_CONST from '~/utils/apiConst';

export default defineComponent({
  name: 'AdminDashboardSidebar',
  components: {
    RiAddCircleFill
  },
  setup() {
    const detailReportRoutePath = API_CONST.FRONT_END.REPORT_DETAIL;
    const detailQuizzRoutePath = API_CONST.FRONT_END.DETAIL_QUIZ;
    const userDetailRoutePath = API_CONST.FRONT_END.USER_DETAIL;

    onMounted(() => {
        
    })

    return {
        detailReportRoutePath,
        detailQuizzRoutePath,
        userDetailRoutePath,
    }
  }
});
</script>
<style scoped>
</style>
