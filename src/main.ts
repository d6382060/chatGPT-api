import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import 'normalize.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'

// 引入路由
import router from './router'

createApp(App).use(router).mount('#app')
