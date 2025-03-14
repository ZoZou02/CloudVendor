// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import Tmap from '@map-component/vue-tmap';
import App from './App.vue'
import { BASE_URL } from './config/config.js'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 设置全局变量
uni.$baseUrl = BASE_URL

export function createApp() {
  const app = createSSRApp(App)
  app.use(Tmap)
  .use(ElementPlus)
  
  return {
    app
  }
}
// #endif