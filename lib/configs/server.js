module.exports = (webpackConfig, {resolve}, projectOptions) => {
  if (process.env.NODE_ENV !== 'development') return

  // webpackConfig
  //   .devServer
  //   // .host(projectOptions.host || '127.0.0.1')
  //   .useLocalIp(true)
  //   .contentBase(resolve('static'))
  //   .port(projectOptions.port || 3000)
  //   .open(true)


  const express = require('express');

  const app = express();

  app.use('/static', express.static(resolve('static')))

  app.listen(projectOptions.port || 8899 , function () {
    console.log('Example app listening on port ' + projectOptions.port || 8899 +'!\n');
  });
}
