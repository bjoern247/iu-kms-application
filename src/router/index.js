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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
    // Lazy Loading
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
      // User is logged in, next step, check if certain role permission is needed to access page (e.g. admin or editor role needed)
      if (editorOnly) {
        if (userData.role === 'editor' || userData.role === 'admin') {
          // User is logged in, atleast editor role required, user is editor or admin -> display page
          next();
        } else {
          // User is logged in, atleast editor role required, but user isn't an admin or editor -> redirect to home page
          next('/') // maybe change to forbidden page
        }
      }
      else if (adminOnly) {
        if (userData.role === 'admin') {
          // User is logged in, admin role required, user is admin -> display page
          next();
        } else {
          // User is logged in, admin role required, but user isn't an admin -> redirect to home page
          next('/') // maybe change to forbidden page
        }
      } else {
        // User is logged in, no additional permissions needed -> display page
        next();
      }
    } else {
      next('/login');
    }
  } else {
    // Display page if authentication is not required
    next();
  }
  
  if (to.path == '/') {
    // Enables BackButton again after Delete Operations
    enableBackButton();
  }
});

export default router