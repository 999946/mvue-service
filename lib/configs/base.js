const fs = require('fs')
const path = require('path')

module.exports = (webpackConfig, {
  resolve,
  getEntryByDir,
  getPagesCompsEntry,
  getEntry,
  getNameByFilePath
}) => {
  const pages = getEntry('src', 'pages');
  const components = getEntry('src', 'components');

  // entry
  webpackConfig
  .merge({
    entry: {
      ...components,
      ...pages,
      'app': [resolve('./src/index.js')],
      'app.json5': [resolve('./src/app.json5')]
    },
  })

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

  webpackConfig.module.rule('app.json')
  .test(/app\.(json|json5)$/)
  .use('file-loader').loader('file-loader')
  .options({
    name: file => {
      console.log('----------------fe', file);
      return getNameByFilePath(file) + '.json'
    },
  }).end()
  .use('string-replace-loader').loader('string-replace-loader')
  .options({
    search: 'module.exports = ',
    replace: '',
  }).end()
  .use('json5-loader').loader('json5-loader')
}
