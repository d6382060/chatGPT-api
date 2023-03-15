import { RouteRecordRaw } from "vue-router";

// 路由数组
export const routes: RouteRecordRaw[] = [
  {
    path:'/',
    redirect:'home'
  },
  {
    path:'/home',
    name:'home',
    component:()=>import('@/pages/home/index.vue'),
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/pages/login/index.vue'),
  }
]