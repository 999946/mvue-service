module.exports = (webpackConfig, {resolve, getNameByFilePath}, projectOptions) => {
  // .vue
  webpackConfig.module.rule('vue')
  .test(/\.vue$/)
  .exclude.add(/node_modules/).end()
  .use('vue-loader').loader('vue-loader')
  .options({
    compiler: {
      // mock vue-template-compiler
      compile: () => ({
        staticRenderFns: [],
      }),
      parseComponent: require('vue-template-compiler').parseComponent,
    },
  }).end()

  // 将 .yaml 文件转成 .json
  // <config lang="yaml">
  webpackConfig.module.rule('yaml')
  .test(/\.ya?ml$/)
  .use('yaml-loader').loader('yaml-loader')

  // 默认将vue html 模板编译成wxml
  webpackConfig.module.rule('vue template to wxml')
  .resourceQuery(/^\?vue&type=template/)
  .use('file-loader').loader('file-loader')
  .options({
    name: file => {
      return getNameByFilePath(file) + '.wxml'
    }
  }).end()
  .use('html2wxml-loader').loader('html2wxml-loader')
  .options({
    limit: projectOptions.limit || 5120,
    publicPath: projectOptions.publicPath || 'http://127.0.0.1:8899'
  })

  // 处理 <template lang="wxml">{...}</template>
  // 生成 .wxml 文件
  webpackConfig.module.rule('wxml template')
  .test(/\.wxml/)
  .use('file-loader').loader('file-loader')
  .options({
    name: file => {
      return getNameByFilePath(file) + '.wxml'
    }
  }).end()

  // 将 vue js script 模板编译加上 import Vue from 'vue
  webpackConfig.module.rule('vue script')
  .resourceQuery(/^\?vue&type=script&lang=js/)
  .use('tua-mp-loader').loader('tua-mp-loader')

  // 处理 <config>{...}</config> 代码块
  // 生成 .json 文件
  webpackConfig.module.rule('vue custom block')
  .resourceQuery(/blockType=config/)
  .use('trim-loader').loader('trim-loader').end()
  .use('file-loader').loader('file-loader')
  .options({
    name: file => getNameByFilePath(file) + '.json',
  })
}
