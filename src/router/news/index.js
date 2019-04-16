/**
 * 该文件是给news这个模块单独配置路由，这是在项目比较复杂的时候可以使用
 * 如果项目复杂度不高，可以不用拆分模块书写路由
 * */

export default [
  {
    path: '/news', // vue页面的路径
    name: 'news', // 跳转该组件的name， 建议在页面中使用该路由时使用name属性来获取跳转链接
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/index.vue') // vue-router中的按需加载路由，前面的注释是给该加载文件设置一个别名，@这个是在vue.config.js中为src配置的别名，index.vue是vue文件，名字可以自己定
  }
]
