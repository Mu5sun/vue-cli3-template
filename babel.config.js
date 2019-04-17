const IS_PROD = process.env.NODE_ENV === 'production'
const plugins = []
if (IS_PROD) {
  plugins.unshift([ // 清除代码中console
    'transform-remove-console',
    {
      exclude: ['error', 'warn']
    }
  ])
}

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins
}
