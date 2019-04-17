// vue.config.js
const merge = require('webpack-merge')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const IS_PROD = process.env.NODE_ENV === 'production'

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: IS_PROD ? '' : '', // 配置打包后的部署路径
  outputDir: 'dist', // 配置打包后的文件夹名称，默认就是dist
  assetsDir: 'assets', // 配置打包后放置静态资源的文件夹
  indexPath: 'index.html', // 配置生成的index.html模版的输出路径，默认是index.html,相对于打包后的主文件夹
  filenameHashing: true, // 配置打包后的文件名进行hash，要求index的html不是cli生成的。如果不是，请改为false
  pages: undefined, // 配置多页应用的入口和出口，单页应用不用配置
  lintOnSave: !IS_PROD, // 配置在开发环境时，进行代码检测
  runtimeCompiler: false, // 配置是否能在vue组件中使用template选项，如果是true，可以使用，但会增加文件大小，不建议
  transpileDependencies: [], // 配置babel-loader忽略node_modules里的所有文件，如果需要转移其中的依赖，在数组中列出
  productionSourceMap: true, // 配置文件打包时需不需要生成map文件，供线上环境的代码错误定位
  crossorigin: undefined, // 配置打包后的html文件中的link和script标签上是否添加crossorigin属性，仅影响构建时注入的文件，不影响模版中的文件
  integrity: false, // 配置打包后的html文件中的link和script标签上是否添加Subresource Integrity属性，仅影响构建时注入的文件，不影响模版中的文件。开启该属性可以提供在cdn上的文件额外的安全，开启时，preload resource hints 会被禁用，因为Chrome的bug
  configureWebpack: config => {
    if (IS_PROD) {
      // 为生产环境修改配置
    } else {
      // 为开发环境修改配置
    }
  },
  chainWebpack: config => {
    // 这里是对环境的配置，不同环境对应不用的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
    if (IS_PROD) {
      // #region 图片压缩
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('img-loader')
        .loader('img-loader').options({
          plugins: [
            require('imagemin-jpegtran')(),
            require('imagemin-pngquant')({
              quality: [0.75, 0.85]
            })
          ]
        })
      // #endregion

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
      // #endregion
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
  },
  devServer: {
    overlay: { // 可以在控制台同时输出警告和错误
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': { // 配置服务器代理
        target: '',
        // 如果要代理websocket
        ws: true,
        changeOrigin: true
      }
    }
  }
}
