// 改写配置之后,需要重启服务器(npm run start)
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {

  // 模式有两种,一种生产,一种开发,
  // 生产(production)会自动压缩,开发(development)则不会
  mode: 'development',

  // 是否加#差别不大,是否预加载???
  // sourceMap是一个映射关系,当报错时,报错的指向(打包后的文件或者打包前的文件),具体看webpack的devtool配置
  // 为none时指向打包后的代码,不写devtool时,默认为eval,不生成.map文件,指向源代码,source-map则生成.map文件
  // inline: inline-source-map不会生成.map文件,会具体到某一列
  // cheap: cheap-inline-source-map报错不会具体到某一列,并且只会管业务文件不会管loader等第三方映射中的问题,打包速度比较快
  // module: 如果还需要管理loader等第三方映射的话,则使用cheap-module-inline-source-map
  // eval: 是打包速度最快的,将代码用eval包裹起来,但可能不全面
  // 开发环境: cheap-module-eval-source-map
  // 生产环境(线上环境): cheap-module-source-map
  devtool: "cheap-module-eval-source-map",

  // webpack-dev-server基础配置,自动打包自动刷新,默认:http://localhost:8080/
  devServer: {
    // 表示在哪个目录下启动服务器
    contentBase: './dist',
    // 打包后自动开启浏览器
    // open: true,
    // proxy: 配置跨域转发
    /* proxy: {
      "/api": 'http://localhost:3000'
    }, */
    // 配置端口号: 默认8080
    port: 8080,
    // 让webpack-dev-server开启Hot Module Replacement热模块更新,比如修改了css,打包过后也只修改css,不会更改之前的页面结构
    hot: true,
    // 即使页面改动没有生效,也不让自动刷新,可配可不配
    // 取消hotOnly后, 改动代码, 会自动的刷新页面
    // hotOnly: true
	},
	
	module: {
		rules: [{
			test: /\.css$/,
			//css-loader: 会在css中找文件间的关系,最后整合成一个css
			//style-loader: 在得到css-loader整合出来的css之后,会将其挂载到html的<head>中
			use: ['style-loader', 'css-loader', 'postcss-loader']
		}, {
			test: /\.scss$/,
			use: [
				//识别sass需要node-sass,sass-loader两个loader
				// loader执行顺序是从下到上,从右到左
				'style-loader',
				{
					// 当在scss文件中又引入scss时,需将css-loader多添加一个配置,如下:
					// 此时,在scss中引入的scss文件,也会走下面两个loader
					loader: 'css-loader',
					options: {
						importLoaders: 2,
						// 开启css的模块化打包,使css只在当前模块中生效
						// 避免css全局引入产生的冲突
						// modules: true
					}
				},
				'sass-loader',
				//使用postcss-loader需要下载autoprefixer插件
				//并新建postcss.config.js配置文件
				//作用: 自动添加厂商前缀,如'-webkit-'
				'postcss-loader'
			]
		}]
	},

  // 插件: 可以在webpack运行到某个时刻的时候,帮你做一些事情(类似生命周期函数)
  plugins: [
    // 由于改动某个模块的内容都会引起重新打包,所以附带的,会自动更新html
    // 当使用上HotModuleReplacementPlugin这个webpack自带插件,可以实现不同模块热更新不互相干扰(需要做额外的处理)
    // 但为什么css文件更改时,没有上方if代码块的监控,也会自动进行HMR热模块更新呢?
    // 在css-loader底层已经自动实现HMR功能
    // 同理: vue-loader底层也自动实现HMR
    new webpack.HotModuleReplacementPlugin(),
	],
	
	// 出口配置
  output: {
    // publicPath: './', // 在打包后的资源路径前,添加的一个根路径,如'http://cdn.com.cn'
    // filename: 'bundle.js', //出口文件名默认为main.js,此时改为bundle.js
    // [name]为占位符,当存在多个入口文件时,生成的js会以entry中的属性名为准,插件HtmlWebpackPlugin会将所有js都引入到生成的html中
		filename: '[name].js',
		chunkFilename: '[name].js',
    // path: path.resolve(__dirname, '../dist') //出口路径,必须写绝对路径,__dirname为根目录
  },
}
module.exports = merge(commonConfig, devConfig);