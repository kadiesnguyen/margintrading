import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)
const routes = [
  {
    mode: 'history',
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../Layouts/Certification.vue'),
    children: [
      {
        path: '/login',
        name: "login",
        component: () => import(/* webpackChunkName: "about" */ '../views/certifications/Login.vue'),
      },

      {
        path: '/register',
        name: "register",
        component: () => import(/* webpackChunkName: "about" */ '../views/certifications/Register.vue'),
      }
    ]
  },

  {
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../Layouts/Verified.vue'),
    children: [{
      path: '/member-center',
      name: "member-center",
      component: () => import('../views/MemberCenter.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/han-muc-tai-chinh',
      name: "han-muc-tai-chinh",
      component: () => import('../views/HanMucTaiChinh.vue'),
      meta: { requiresAuth: true }
    },
  
    {
      path: '/change-password',
      name: "change-password",
      component: () => import('../views/certifications/ChangePassword.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/recharge",
      name: "recharge",
      component: ()=> import('../views/Recharge.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/withdraw",
      name: "withdrawwithdraw",
      component: ()=> import('../views/Withdraw.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: "/transaction-history/:pathMatch(withdraw|recharge)?",
      name: "transaction-history",
      component: ()=> import('../views/TransactionHistory.vue'),
      meta: { requiresAuth: true }
    }
  ]
  },


  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'home' }
  }
]

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.hasOwnProperty("userToken");
  if (to.meta.requiresAuth && !isLoggedIn) {
    next( {
      name: 'login',
    })
  }
  if (isLoggedIn && ["login", "register"].includes(to.name)) {
    next ({
      name: "home"
    })
  }
  next()
})



export default router
