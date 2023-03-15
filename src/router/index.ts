import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router'

// 批量导出路由
const module:any = import.meta.glob('./modules/*.ts',{eager:true})

// 路由数组

const routes:RouteRecordRaw[] = []

// 遍历路由模块
for(const path in module){
  const route = module[path].routes
  routes.push(...route)
}

// 创建路由
const router = createRouter({
  history:createWebHistory(),
  routes
})


// 路由导航守卫
router.beforeEach((to,from,next)=>{
  let token = localStorage.getItem('token') || ''
  if(!token){
    if(to.path === '/login'){
      next()
    }else{
      next('/login')
    }
    return
  }
  // 设置页面标题
  document.title = to.meta.title || 'vue3.0+ts+vue-router+vuex+element-plus'
  next()
})

// 导出路由
export default router