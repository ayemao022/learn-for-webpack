// 改写配置之后,需要重启服务器(npm run start)
const merge = require("webpack-merge");
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const prodConfig = {

  // 模式有两种,一种生产,一种开发,
  // 生产(production)会自动压缩,开发(development)则不会
  mode: 'production',

  // 是否加#差别不大,是否预加载???
  // sourceMap是一个映射关系,当报错时,报错的指向(打包后的文件或者打包前的文件),具体看webpack的devtool配置
  // 为none时指向打包后的代码,不写devtool时,默认为eval,不生成.map文件,指向源代码,source-map则生成.map文件
  // inline: inline-source-map不会生成.map文件,会具体到某一列
  // cheap: cheap-inline-source-map报错不会具体到某一列,并且只会管业务文件不会管loader等第三方映射中的问题,打包速度比较快
  // module: 如果还需要管理loader等第三方映射的话,则使用cheap-module-inline-source-map
  // eval: 是打包速度最快的,将代码用eval包裹起来,但可能不全面
  // 开发环境: cheap-module-eval-source-map
  // 生产环境(线上环境): cheap-module-source-map
	devtool: "cheap-module-source-map",
	module: {
		rules: [{
			test: /\.css$/,
			//css-loader: 会在css中找文件间的关系,最后整合成一个css
			//style-loader: 在得到css-loader整合出来的css之后,会将其挂载到html的<head>中
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
		}, {
			test: /\.scss$/,
			use: [
				//识别sass需要node-sass,sass-loader两个loader
				// loader执行顺序是从下到上,从右到左
				MiniCssExtractPlugin.loader,
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
	optimization: {
		// 自动将css代码合并, 并压缩
		minimizer: [new OptimizeCSSAssetsPlugin({})]
	},
	plugins: [
		// 借助该插件, 可以将css文件单独打包
		// 注意:
		// 1.该插件只支持线上打包, 不支持HMR(热更新), 如果用在开发环境中, 需要手动刷新页面
		// 2.需要将style-loader改成MiniCssExtractPlugin.loader
		// 3.因为使用了optimization: {usedExports: true}配置, 就需要将package.json中的sideEffects配置为['*.css'], 表示tree shaking时忽略.css文件
		// 如果引入多个css文件, 该插件会将这多个css合并到一个.css文件中
		new MiniCssExtractPlugin({
			// 在html中直接引入
			filename: '[name].css',
			// 没在html中直接引入, 而在其他时候被间接引入
			chunkFilename: '[name].chunk.css'
		})
	]
}

module.exports = merge(commonConfig, prodConfig);


