// 在node中直接使用webpack 查看官方文档 api下的 node.js API
// 直接在命令行中使用webpack 查看官方文档api 命令行接口

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware'); //webpack中间件
const config = require('./webpack.config.js');
const complier = webpack(config); //根据config进行编译配置文件,当改动配置文件时,会自动编译

// 创建服务器实例 app
const app = express();
// 中间件使用方法: express实例.use()
// 两个参数: 1.编译器complier, 2.对象
app.use(webpackDevMiddleware(complier, {
  // 当不写publicPath配置时,需将config中的publicPath也去掉,双方都去掉则默认和当前写上一样
  publicPath: config.output.publicPath
}))

// 监听3000端口
app.listen(3000, () => {
  console.log('server is running!')
})