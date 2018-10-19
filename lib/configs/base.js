const fs = require('fs')
const path = require('path')

module.exports = (webpackConfig, {
  resolve,
  getEntryByDir,
  getPagesCompsEntry,
  getEntry
}) => {
  const pages = getEntry('src', 'pages');
  const components = getEntry('src', 'components');

  // entry
  webpackConfig
  .merge({
    entry: {
      ...components,
      ...pages
    },
  })
  // app 应用入口
  .entry('app').add(resolve('./src/index.js')).end()

  // output
  webpackConfig.output
  .path(resolve('dist'))
  .filename(`[name].js`)
  .globalObject('global')

  // 文件扩展名
  webpackConfig.resolve.extensions
  .merge(['.js', '.vue', '.json'])

  // 别名
  webpackConfig.resolve.alias
  .set('@', resolve('src'))
  .set('@utils', resolve('src/scripts/utils'))
  .set('@const', resolve('src/scripts/constants'))

  // 提取公共依赖
  webpackConfig.optimization
  // webpack runtime
  .runtimeChunk({name: 'chunks/runtime'})
  .splitChunks({
    cacheGroups: {
      // npm 包
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'chunks/vendors',
        chunks: 'all',
      },
      // 项目公共函数
      scripts: {
        test: function (chunk) {
          // 将项目下除了vue文件里的js全提取到scripts文件里
          if (/[\\/]src[\\/].*\.js/.test(chunk.resource)) {
            return true
          }
          return false
        },
        name: 'chunks/scripts',
        chunks: 'all',
        // 强制提取
        enforce: true,
      },
    },
  })
}
