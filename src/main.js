import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './components' // 导入该文件，可以进行全局组件的注册

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
