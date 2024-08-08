<template>
    <div class="row ms-4 me-4">
        <div class="app-email card">
            <div class="row g-0">
                <!-- Email Sidebar -->
                <div class="col-lg-3 app-email-sidebar border-end flex-grow-0">
                    <div class="btn-compost-wrapper d-grid">
                        <button class="btn btn-primary btn-compose" data-bs-toggle="modal"
                            data-bs-target="#emailComposeSidebar">
                            Thư viện của tôi
                        </button>
                    </div>
                    <!-- Email Filters -->
                    <div class="email-filters py-2">
                        <!-- Email Filters: Folder -->
                        <ul class="email-filter-folders list-unstyled mb-4">
                            <li class="active d-flex justify-content-between" data-target="inbox">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-mail"></i>
                                    <span class="align-middle ms-2">Tất cả</span>
                                </a>
                                <div class="badge bg-label-primary rounded-pill badge-center">4
                                </div>
                            </li>
                            <li class="d-flex" data-target="sent">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-send ti-xs"></i>
                                    <span class="align-middle ms-2">Được chia sẻ với tôi</span>
                                </a>
                            </li>
                            <li class="d-flex" data-target="draft">
                                <a href="javascript:void(0);" class="d-flex flex-wrap align-items-center">
                                    <i class="ti ti-file"></i>
                                    <span class="align-middle ms-2">Được tạo bởi tôi</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--/ Email Sidebar -->
                <!-- Emails List -->
                <div class="col app-emails-list">
                    <div class="shadow-none border-0">
                        <hr class="container-m-nx m-0" />
                        <!-- Email List: Items -->
                        <div class="email-list pt-0">
                            <ul class="list-unstyled m-0">
                                <li class="email-list-item" data-starred="true" data-bs-toggle="sidebar"
                                    data-target="#app-email-view">
                                    <div class="d-flex align-items-center">
                                        <div class="flex flex-col items-center bg-primary">
                                            <div class="h-18 w-18 relative rounded-sm overflow-hidden bg-lilac">
                                                <div class="v-image"><img
                                                        class="lazy-img rounded-inherit object-contain"
                                                        alt="Quiz image"
                                                        width="100"
                                                        src="https://cf.quizizz.com/img/logos/new/logo_placeholder_sm.webp?w=100&amp;h=100">
                                                </div>
                                            </div><!---->
                                        </div>
                                        <div class="row flex-col h-full">
                                            <div class="title-content-list-answer ms-3 mb-0 mt-2">
                                                <p class="text-start fs-5 fw-bold mb-0">Wc gần nhất diễn ra vào năm nào?</p>
                                            </div>
                                            <div class="title-content-list-answer ms-3 d-flex justify-content-between col-md-7 mt-2">
                                                <p class="text-start fs-6">4 câu hỏi</p>
                                                <p class="text-start fs-6">CNTT</p>
                                                <p class="text-start fs-6">6 lượt chơi</p>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="row d-flex justify-content-between">
                                                    <div class="title-content-list-answer ms-3 mb-0 d-flex justify-content-between col-md-4">
                                                        <p class="text-start fs-6">nam.dovan1</p>
                                                        <p class="text-start fs-6">2 tháng trước</p>
                                                    </div>
                                                    <div class="col-md-6 d-flex justify-content-end">
                                                        <button class="btn btn-link">
                                                            Chia sẻ
                                                        </button>
                                                        <nuxt-link class="btn btn-primary ms-3" to="/admin/dashboard/activity/397639679476497">
                                                            Chơi ngay
                                                        </nuxt-link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="app-overlay"></div>
                </div>
                <!-- /Emails List -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    setup() {

    onMounted(async () => {
      
    });

    return {
      
    }
  }
})
</script>
<style scoped>
</style>