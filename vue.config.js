// vue.config.js
const merge = require('webpack-merge')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: () => ({
    devtool: 'source-map'
  }),
  chainWebpack: config => {
    // 这里是对环境的配置，不同环境对应不用的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
    if (process.env.NODE_ENV === 'production') {
      // #region 启用GZip压缩，前端使用了GZip压缩，后端也要配合开启GZip
      config.plugin('compression').use(CompressionPlugin, {
        // 目标文件名称。[path] 被替换为原始文件的路径和 [query]查询
        asset: '[path].gz[query]',
        // 使用 gzip 压缩
        algorithm: 'gzip',
        // 处理与此正则想匹配的所有文件
        test: new RegExp('\\.(js|css)$'),
        // 只处理大于此大小的文件
        threshold: 10240,
        // 最小压缩比达到 0.8 时才会被压缩
        minRatio: 0.8,
        cache: true
      })
    }
    // #region
    // 将这些指定的文件不进行打包
    var externals = {
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
      vuex: 'Vuex'
    }
    config.externals(externals)
    // 去cdn上获取，在index.html模版中进行了处理
    const cdn = {
      css: [],
      js: [
        // vue
        '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
        // vue-router
        '//unpkg.com/vue-router@3.0.5/dist/vue-router.min.js',
        // vuex
        '//unpkg.com/vuex@3.1.0/dist/vuex.min.js',
        // axios
        '//unpkg.com/axios/dist/axios.min.js'
      ]
    }
    // #endregion
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
    // 这里是用来给引用文件配置别名，修改的是webpack中的resolve属性
    config.resolve.alias
      .set('@', resolve('src'))
    // 这里是给文件增加loader，修改的webpack中的module属性
    config.module
      .rule('images') // 针对图片进行一个loader处理
      .use('url-loader') // 让图片使用url-loader来解析
      .tap(options => {
        merge(options, {
          limit: 5120 // 当图片没有超过指定的大小时，转为base64的文件，保存在静态资源中
        })
      })
  }
}
