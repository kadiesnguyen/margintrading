/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import i18n from "./i18n/i18n";
i18n.locale = localStorage.getItem("language") || "vi";
import Vue from "vue";
import Router from "vue-router";
//import auth from "@/auth/authService";
import { checkRole } from "@/helpers/helpers.js";
//import firebase from 'firebase/app'
//import 'firebase/auth'

Vue.use(Router);

const router = new Router({
  mode: "history",
  //base: process.env.BASE_URL,
  base: "/portal",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "/",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: "/",
          redirect: "/analytics",
        },
        {
          path: "/analytics",
          name: "admin-analytics",
          component: () => import("./views/DashboardAnalytics.vue"),
          meta: {
            rule: "editor",
          },
        },
        // Route Account

        {
          path: "/account/list-all-account",
          name: "list-all-account",
          component: () => import("./layouts/account/AccountAllMemberList.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("listAccount"), active: true },
            ],
            pageTitle: i18n.t("all"),
            rule: "editor",
          },
        },

        // {
        //     path: '/account/list-verify-account',
        //     name: 'list-verify-account',
        //     component: () => import('./layouts/account/AccountVerifyList.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Danh sách xác minh', active: true },
        //         ],
        //         pageTitle: 'Xác minh',
        //         rule: 'editor'
        //     },
        // },
        {
          path: "/account/list-agency-account",
          name: "list-agency-account",
          component: () => import("./layouts/account/AccountAgencyList.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("danhsachdaily"), active: true },
            ],
            pageTitle: i18n.t('nhanvien'),
            rule: "editor",
          },
        },

        // kết thúc account

        // Route Danh sách lịch sử

        {
          path: "/history/data-list/list-deposit-view",
          name: "list-history-deposit",
          component: () => import("./layouts/history/ListHisNapTien.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("danhsach"), active: true },
            ],
            pageTitle: i18n.t("danhsachnaptien"),
            rule: "editor",
          },
        },

        {
          path: "/history/data-list/list-withdrawal-view",
          name: "list-history-withdrawal",
          component: () => import("./layouts/history/ListHisRutTien.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("danhsach"), active: true },
            ],
            pageTitle: i18n.t("xemlichsurut"),
            rule: "editor",
          },
        },

        // {
        //     path: '/history/data-list/list-trade-view',
        //     name: 'list-history-trade',
        //     component: () => import('./layouts/history/ListHisTrade.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Danh sách', active: true },
        //         ],
        //         pageTitle: 'Danh sách giao dịch',
        //         rule: 'editor'
        //     },
        // },

        {
          path: "/history/data-list/list-bet-view",
          name: "list-bet-trade",
          component: () => import("./layouts/history/ListHisBet.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("danhsach"), active: true },
            ],
            pageTitle: i18n.t("danhsachdatcuoc"),
            rule: "editor",
          },
        },

        // {
        //     path: '/history/data-list/list-exchange-view',
        //     name: 'list-history-exchange',
        //     component: () => import('./layouts/history/ListHisExChange.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Danh sách', active: true },
        //         ],
        //         pageTitle: 'Danh sách đổi tiền',
        //         rule: 'editor'
        //     },
        // },

        // {
        //     path: '/history/data-list/list-addmoney',
        //     name: 'list-history-addmoney',
        //     component: () => import('./layouts/history/ListHisAddMoney.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Danh sách', active: true },
        //         ],
        //         pageTitle: 'Danh sách thêm tiền',
        //         rule: 'editor'
        //     },
        // },

        // kết thúc danh sách lịch sử

        // giải đấu
        // {
        //     path: '/champion',
        //     name: 'create-champion',
        //     component: () => import('./layouts/game/Champion.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Giái đấu', active: true },
        //         ],
        //         pageTitle: 'Tạo giải đấu',
        //         rule: 'editor'
        //     },
        // },

        // rút thăm may mắn
        // {
        //     path: '/lucky',
        //     name: 'Lucky draw',
        //     component: () => import('./layouts/game/LuckyDraw.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Rút thăm may mắn', active: true },
        //         ],
        //         pageTitle: 'Rút thăm may mắn',
        //         rule: 'editor'
        //     },
        // },

        // blog

        // {
        //     path: '/history/data-list/list-post-news',
        //     name: 'list-post-news',
        //     component: () => import('./layouts/history/ListPostNews.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Danh sách bài viết', active: true },
        //         ],
        //         pageTitle: 'Danh sách',
        //         rule: 'editor'
        //     },
        // },

        // {
        //     path: '/tool/data-tool/post-news',
        //     name: 'post-news',
        //     component: () => import('./layouts/tool/PostNews.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Công cụ đăng bài', active: true },
        //         ],
        //         pageTitle: 'Viết bài',
        //         rule: 'editor'
        //     },
        // },

        // end blog

        // công cụ

        // {
        //     path: '/tool/data-tool/edit-commission',
        //     name: 'tool-edit-commission',
        //     component: () => import('./layouts/tool/EditCommission.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Công cụ chỉnh sửa hoa hồng', active: true },
        //         ],
        //         pageTitle: 'Hoa hồng',
        //         rule: 'editor'
        //     },
        // },
        // {
        //     path: '/tool/data-tool/add-money',
        //     name: 'tool-add-money',
        //     component: () => import('./layouts/tool/AddMoney.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Trang chủ', url: '/' },
        //             { title: 'Công cụ cộng tiền', active: true },
        //         ],
        //         pageTitle: 'Cộng tiền',
        //         rule: 'editor'
        //     },
        // },
        {
          path: "/tool/data-tool/payment-methods",
          name: "tool-payment-methods",
          component: () => import("./layouts/tool/PaymentMethods.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("phuongthucthanhtoan"), active: true },
            ],
            pageTitle: i18n.t("phuongthucthanhtoan"),
            rule: "editor",
          },
        },

        {
          path: "/tool/data-tool/edit-bet",
          name: "tool-edit-bet",
          component: () => import("./layouts/tool/EditKetQua.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              {
                title: i18n.t("congcuchinhsuatrochoi"),
                active: true,
              },
            ],
            pageTitle: i18n.t("becau"),
            rule: "admin",
          },
        },

        {
          path: "/tool/data-tool/setting",
          name: "tool-setting",
          component: () => import("./layouts/tool/Setting.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: i18n.t("caidat"), active: true },
            ],
            pageTitle: i18n.t("caidat"),
            rule: "admin",
          },
        },

        // kết thúc công cụ
      ],
      meta: {
        requiresAuth: true,
      },
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================

        {
          path: "/pages/login",
          name: "page-login",
          component: () => import("@/views/pages/login/Login.vue"),
          meta: {
            rule: "editor",
            hideForAuth: true,
          },
        },
        {
          path: "/pages/error-404",
          name: "page-error-404",
          component: () => import("@/views/pages/Error404.vue"),
          meta: {
            rule: "editor",
          },
        },
        {
          path: "/pages/error-500",
          name: "page-error-500",
          component: () => import("@/views/pages/Error500.vue"),
          meta: {
            rule: "editor",
          },
        },
        {
          path: "/pages/not-authorized",
          name: "page-not-authorized",
          component: () => import("@/views/pages/NotAuthorized.vue"),
          meta: {
            rule: "editor",
          },
        },
        {
          path: "/pages/maintenance",
          name: "page-maintenance",
          component: () => import("@/views/pages/Maintenance.vue"),
          meta: {
            rule: "editor",
          },
        },
      ],
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404",
    },
  ],
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
  document.title = "CMS BO";
});

router.beforeEach((to, from, next) => {
  //firebase.auth().onAuthStateChanged(() => {

  // get firebase current user
  //const firebaseCurrentUser = firebase.auth().currentUser

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("token");

    if (!token) {
      next({ name: "page-login" });
    } else {
      next();
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }

  if (to.matched.some((record) => record.meta.rule == "admin")) {
    if (checkRole("*")) {
      next();
    } else {
      next({ name: "admin-analytics" });
    }
  }

  if (to.matched.some((record) => record.meta.hideForAuth)) {
    const token = localStorage.getItem("token");
    if (token) {
      next({ name: "admin-analytics" });
    } else {
      next();
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
  // if (
  //     to.path === "/pages/login" ||
  //     to.path === "/pages/forgot-password" ||
  //     to.path === "/pages/error-404" ||
  //     to.path === "/pages/error-500" ||
  //     to.path === "/pages/register" ||
  //     to.path === "/callback" ||
  //     to.path === "/pages/comingsoon" ||
  //     (auth.isAuthenticated() || firebaseCurrentUser)
  // ) {
  //     return next();
  // }

  // If auth required, check login. If login fails redirect to login page
  // if(to.meta.authRequired) {
  //   if (!(auth.isAuthenticated() || firebaseCurrentUser)) {
  //     router.push({ path: '/pages/login', query: { to: to.path } })
  //   }
  // }

  //return next()
  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  // auth.login({ target: to.path });

  //});
});

export default router;
