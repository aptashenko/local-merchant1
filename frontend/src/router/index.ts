import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/ProfilePage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  {
    path: '/add',
    name: 'AddService',
    component: () => import('../pages/AddServicePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/services/edit/:id',
    name: 'EditService',
    component: () => import('../pages/EditServicePage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  const isLoggedIn = !!authStore.token;

  // Защита приватных маршрутов
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // Защита гостевых маршрутов (если уже залогинен)
  if (to.meta.requiresGuest && isLoggedIn) {
    return next('/profile')
  }

  next()
})

export default router
