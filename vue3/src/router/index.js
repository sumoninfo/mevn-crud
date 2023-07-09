import {createRouter, createWebHistory} from 'vue-router'

//Web route
import WebLayout   from "@/views/web/Layout";
import webRoutes   from "@/views/web/_routes";
//Admin route
import AdminRoutes from "@/views/admin/_routes";
import AdminLayout from "@/views/admin/Layout";
//Auth route
import AuthRoutes  from "@/views/auth/_routes";

const routes = [
  //Web routing
  {
    path     : '/',
    name     : 'website',
    component: WebLayout,
    children : webRoutes
  },
  //Auth routing
  {
    path     : '/',
    name     : 'Authentication',
    component: WebLayout,
    children : AuthRoutes
  },
  //Admin routing
  {
    path     : '/',
    component: AdminLayout,
    children : AdminRoutes,
    meta     : {
      requireAuth: true,
    }
  },
  {
    path     : "/:pathMatch(.*)*",
    name     : "not-found",
    component: () => import("@/components/NotFound.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
