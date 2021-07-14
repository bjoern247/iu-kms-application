import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import useFirebaseAuth, { enableBackButton, getUserData } from '../store/firebase';

const state = useFirebaseAuth();
const userData = getUserData();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
      editorOnly: false,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: true,
      adminOnly: false
    }
  },
  {
    path: '/assigned-tickets',
    name: 'MyTickets',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/editor/MyTickets.vue'),
    meta: {
      requiresAuth: true,
      editorOnly: true,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: true,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: true
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: false
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
      requiresAuth: true,
      editorOnly: false,
      adminOnly: false
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
  const editorOnly = to.matched.some(record => record.meta.editorOnly);
  const adminOnly = to.matched.some(record => record.meta.adminOnly);
  if (requiresAuth) {
    if (state.user.value !== null) {
      console.log(userData.role);
      if (editorOnly) {
        if (userData.role === 'editor' || userData.role === 'admin') {
          next();
        } else {
          next('/') // maybe change with forbidden page
        }
      }
      else if (adminOnly) {
        if (userData.role === 'admin') {
          next();
        } else {
          next('/') // maybe change with forbidden page
        }
      } else {
        next();
      }
    } else {
      next();
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