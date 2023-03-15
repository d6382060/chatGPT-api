// 路由meta的类型
import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta {
    title?: string
  }
}