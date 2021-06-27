import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import useFirebaseAuth, { enableBackButton } from '../store/firebase';

const state = useFirebaseAuth();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ticket-overview',
    name: 'TicketOverview',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/TicketOverview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-course',
    name: 'CourseCreation',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/CourseCreation.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user-overview',
    name: 'UserOverview',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/UserOverview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/course-overview',
    name: 'CourseOverview',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/CourseOverview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/editor/MyCourses.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/course-editors/:id',
    name: 'CourseEditors',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/CourseEditors.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ticket-detail-view/:id',
    name: 'TicketDetailView',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/TicketDetailView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/course-detail-view/:id',
    name: 'CourseDetailView',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/editor/CourseDetailView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/course-edit/:id',
    name: 'CourseAdministration',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/CourseAdministration.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user-detail-view/:id',
    name: 'UserAdministration',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/admin/UserAdministration.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-ticket',
    name: 'TicketCreation',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/student/TicketCreation.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    if (state.user.value !== null) {
      next();
    } else {
      next('Login');
    }
  } else {
    next();
  }
  if (to.path == '/') {
    // Enables BackButton again after Delete Operations
    enableBackButton();
  }
});

export default router