module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-sprites': { // 可以生成雪碧图，使用的时候直接引入小图片，该配置会自动把小图片合成
      basePath: './dist',
      spritePath: './dist/images/sprites',
      retina: true,
      filterBy: function (image) {
        // 只合成 sprites 目录下的图片，并且是 .png 为后缀
        if (image.url.includes('sprites')) {
          if (!/\.png$/.test(image.url)) {
            return Promise.reject(new Error('Allow only png files'))
          }
          return Promise.resolve()
        }
        return Promise.reject(new Error('Allow only png files'))
      }/* ,
       该配置是在小图片很多的情况下，分模块打包
      groupBy: function (image) {
        const spritesPaths = image.url.split('sprites')
        if (spritesPaths.length > 1) {
          const spriteImagePaths = spritesPaths[1].split('/')
          if (spriteImagePaths.length > 2) {
            const groupName = spriteImagePaths[1]
            return Promise.resolve(groupName)
          } else {
            return Promise.reject(new Error('Not a group name'))
          }
        } else {
          return Promise.reject(new Error('Not a group name'))
        }
      } */
    },
    'postcss-px-to-viewport': { // 该插件可以将px转换成vw，注意兼容
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750 （如果我们设置的宽度是300px，那么编译之后的宽度为(300/750*100)=40vw,如果频宽实际为375px，那么该元素的宽度为（375*0.4）= 150px）
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 5, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除)
      viewportunit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
      propList: ['*'] // 可以指定不转换的属性，*代表全部转换
    }
  }
}
