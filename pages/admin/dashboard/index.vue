<template>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <!-- Menu -->
            <AdminDashboardSidebar />
            <!-- / Menu -->
            <!-- Layout container -->
            <div class="layout-page">
                <!-- Navbar search -->
                <AdminDashboardNavSearch />
                <!-- / Navbar search -->
                <!-- Content wrapper -->
                <div class="content-wrapper">
                    <!-- Content -->
                    <div class="container-xxl flex-grow-1 container-p-y">
                        <div class="row ms-4 me-4">
                            <!-- content layout -->
                            <div class="app-email card">
                                <div class="row g-0">
                                    <!-- Email Sidebar -->
                                    <div class="col-lg-3 app-email-sidebar border-end flex-grow-0">
                                        <div class="btn-compost-wrapper d-grid">
                                            <button class="btn btn-primary btn-compose" data-bs-toggle="modal"
                                                data-bs-target="#emailComposeSidebar">
                                                Compose
                                            </button>
                                        </div>
                                        <!-- Email Filters -->
                                        <div class="email-filters py-2">
                                            <!-- Email Filters: Folder -->
                                            <ul class="email-filter-folders list-unstyled mb-4">
                                                <li class="active d-flex justify-content-between" data-target="inbox">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-mail"></i>
                                                        <span class="align-middle ms-2">Inbox</span>
                                                    </a>
                                                    <div class="badge bg-label-primary rounded-pill badge-center">4
                                                    </div>
                                                </li>
                                                <li class="d-flex" data-target="sent">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-send ti-xs"></i>
                                                        <span class="align-middle ms-2">Sent</span>
                                                    </a>
                                                </li>
                                                <li class="d-flex" data-target="draft">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-file"></i>
                                                        <span class="align-middle ms-2">Draft</span>
                                                    </a>
                                                </li>
                                                <li class="d-flex justify-content-between" data-target="starred">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-star"></i>
                                                        <span class="align-middle ms-2">Starred</span>
                                                    </a>
                                                    <div class="badge bg-label-warning rounded-pill badge-center">10
                                                    </div>
                                                </li>
                                                <li class="d-flex align-items-center" data-target="spam">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-info-circle"></i>
                                                        <span class="align-middle ms-2">Spam</span>
                                                    </a>
                                                </li>
                                                <li class="d-flex align-items-center" data-target="trash">
                                                    <a href="javascript:void(0);"
                                                        class="d-flex flex-wrap align-items-center">
                                                        <i class="ti ti-trash"></i>
                                                        <span class="align-middle ms-2">Trash</span>
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
                                                    <li class="email-list-item" data-starred="true"
                                                        data-bs-toggle="sidebar" data-target="#app-email-view">
                                                        <div class="d-flex align-items-center">
                                                            <div class="form-check mb-0">
                                                                <input class="email-list-item-input form-check-input"
                                                                    type="checkbox" id="email-1" />
                                                                <label class="form-check-label" for="email-1"></label>
                                                            </div>
                                                            <i
                                                                class="email-list-item-bookmark ti ti-star ti-xs d-sm-inline-block d-none cursor-pointer ms-2 me-3"></i>
                                                            <img src="../../assets/img/avatars/1.png" alt="user-avatar"
                                                                class="d-block flex-shrink-0 rounded-circle me-sm-3 me-2"
                                                                height="32" width="32" />
                                                            <div class="email-list-item-content ms-2 ms-sm-0 me-2">
                                                                <span class="h6 email-list-item-username me-2">Chandler
                                                                    Bing</span>
                                                                <span
                                                                    class="email-list-item-subject d-xl-inline-block d-block">
                                                                    Focused impactful open issues from the project of
                                                                    GitHub</span>
                                                            </div>
                                                            <div
                                                                class="email-list-item-meta ms-auto d-flex align-items-center">
                                                                <span
                                                                    class="email-list-item-label badge badge-dot bg-danger d-none d-md-inline-block me-2"
                                                                    data-label="private"></span>
                                                                <small class="email-list-item-time text-muted">08:40
                                                                    AM</small>
                                                                <ul
                                                                    class="list-inline email-list-item-actions text-nowrap">
                                                                    <li class="list-inline-item email-read"><i
                                                                            class="ti ti-mail-opened"></i></li>
                                                                    <li class="list-inline-item email-delete"><i
                                                                            class="ti ti-trash"></i></li>
                                                                    <li class="list-inline-item"><i
                                                                            class="ti ti-archive"></i></li>
                                                                </ul>
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
                            <!--/ end contenr layout-->
                        </div>
                    </div>
                    <!-- / Content -->
                    <!-- Footer -->
                    <footer class="content-footer footer bg-footer-theme">
                        <div class="container-xxl">
                            <div
                                class="footer-container d-flex align-items-center justify-content-between py-2 flex-md-row flex-column">

                            </div>
                        </div>
                    </footer>
                    <!-- / Footer -->
                    <div class="content-backdrop fade"></div>
                </div>
                <!-- Content wrapper -->
            </div>
            <!-- / Layout page -->
        </div>
        <!-- Overlay -->
        <div class="layout-overlay layout-menu-toggle"></div>
        <!-- Drag Target Area To SlideIn Menu On Small Screens -->
        <div class="drag-target"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

definePageMeta({
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