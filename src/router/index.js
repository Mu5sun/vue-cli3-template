/**
 * 该写法在router中每新增一个模块时，都要将新增的这个模块import进来，然后再routes这个数组中加入。该写法需要手写添加新的模块路由，下面一种写法是自动添加。
import Vue from 'vue'
import Router from 'vue-router'
import newsRouterConfig from './news'
import productRouterConfig from './product'

Vue.use(Router)

const routes = [...newsRouterConfig, ...productRouterConfig]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
}) */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const IndexRoute = { // 设置用户一进入的页面，匹配根目录"/",重定向到设置好的首页的路径，建议用name
  path: '/',
  redirect: {
    name: 'home'
  }
}

let routes = [
  IndexRoute,
  {
    path: '/login', // 这个路由配置写在这是因为它只有一个路由，所有没有单独写成一个模块，不过可以按照个人需求，也可以写成一个模块
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '*', // 这是防止用户输入任意url时访问不到页面，一般如果有用户权限限制时，都会进行路由守卫的设置，所有这一步基本是放在路由守卫中进行权限的过滤和404的跳转
    redirect: {
      name: 'login'
    }
  }
]

const routerContext = require.context('./', true, /index\.js$/)

routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 不处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  /**
   * 兼容 import export 和 require module.exports 两种规范
   */
  routes = [...routes, ...(routerModule.default || routerModule)]
})

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
