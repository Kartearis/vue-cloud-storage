import Vue from 'vue'
import VueRouter from 'vue-router'
import FileView from '../views/FileView.vue'
import AuthView from "@/views/AuthView";
import RegisterView from "@/views/RegisterView";

import {useAuthStore} from "@/store/authStore";

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/:folderId?',
    name: 'Files',
    component: FileView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  routes
})

// Deny access to unauthorized users and redirect them to auth
// From official docs https://v3.router.vuejs.org/guide/advanced/meta.html
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const userStore = useAuthStore();
    if (!userStore.isAuthorized) {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      });
    } else {
      next()
    }
  } else {
    next()
  }
});

// Subscribe to state changes to handle empty token
useAuthStore().$subscribe((
    mutation,
    state
) => {
    if (state.user.token.value == null)
        if (router.currentRoute.name !== 'Auth')
            router.push('/auth');
});

export default router
