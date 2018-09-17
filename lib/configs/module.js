module.exports = (webpackConfig, tools, projectOptions) => {
    // babel
    webpackConfig.module.rule('babel')
        .test(/\.js$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('babel')
        .loader('babel-loader')

    // 图片转成 base64 或者发布到服务器
   webpackConfig.module.rule('image assets')
    .test(/\.(png|jpg|jpeg|gif)$/)
    .use('url')
    .loader('url-loader')
    .options({
      name: '[path][name].[ext]',
      limit: projectOptions.limit || 5120,
      publicPath: projectOptions.publicPath || 'http://127.0.0.1:8899',
      emitFile: false
    })

    // 除了图片的其它资源，直接打包
    webpackConfig.module.rule('other assets')
        .test(/\.(svg|woff|woff2)$/)
        .use('url')
        .loader('url-loader')
        .options({
            name: '[path][name].[ext]'
        })

    // 文件加载器，处理文件静态资源
    webpackConfig.module.rule('assets')
        .test(/\.(eot|ttf|wav|mp3)$/)
        .use('assets')
        .loader('file-loader')
        .options({ name: '[path][name].[ext]' })
}
