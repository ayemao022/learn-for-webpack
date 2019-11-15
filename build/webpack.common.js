const path = require('path') //node自带的模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); //处理html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //**注意** 这里需要用解构赋值的写法引入

module.exports = {

  // 入口配置
  entry: {
    // 打包多个文件(多个入口)
    // lodash: './src/lodash.js',
    // 等价于直接写字符串 './src/index.js' 默认为main
    main: './src/index.js',
    // sub: './src/index.js',
  },

  // 出口配置
  output: {
    publicPath: './', // 在打包后的资源路径前,添加的一个根路径,如'http://cdn.com.cn'
    // filename: 'bundle.js', //出口文件名默认为main.js,此时改为bundle.js
    // [name]为占位符,当存在多个入口文件时,生成的js会以entry中的属性名为准,插件HtmlWebpackPlugin会将所有js都引入到生成的html中
		// filename: '[name].js',
		// chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist') //出口路径,必须写绝对路径,__dirname为根目录
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/, //忽略第三方代码
      // babel-loader只是将webpack和babel联系起来,并不能将ES6转化成ES5
      loader: 'babel-loader',

      // 还需要借助 @babel/preset-env做语法转换(但是不够全面,例如promise,map()等就不行)
      // 再借助 @babel/polyfill,将所需变量(没有转化的promise,map等变量或函数)进行补充 PS: @babel/polyfill直接在入口文件中导入即可
      // options: { // 如果babel的options配置比较多,可以将options的整个对象单独提出来,放在根目录下的.babelrc配置文件里,该文件中不能写注释
      //   // presets: [['@babel/preset-env', {
      //   //     // 项目打包运行的浏览器版本,当目标浏览器(版本)支持某些ES6代码时,将不进行转化,优化打包生成的js的文件大小
      //   //     targets: {
      //   //       edge: "17",
      //   //       firefox: "60",
      //   //       chrome: "67",
      //   //       safari: "11.1",
      //   //     },
      //   //     // 给preset-env添加配置,可以根据业务代码,按需打包@babel/polyfill中转化成ES5的工具代码
      //   //     // 如若不写该useBuiltIns配置,则会将所有转化代码加入main.js,使打包后的文件过大
      //   //     useBuiltIns: 'usage' //如果使用了'usage',可以不用在入口文件中引入@babel/polyfill
      //   // }]]

      //   // 如果写的是业务代码,只需要使用上面的配置即可
      //   // 如果写的是库/组件的代码,则需要使用@babel/plugin-transform-runtime插件,可以避免@babel/preset-env或者说@babel/polyfill的问题
      //   // 因为@babel/polyfill的变量及函数注入是在全局,会污染全局环境,而@babel/plugin-transform-runtime会以闭包的形式间接的引入对应的内容,比较合理
      //   "plugins": [["@babel/plugin-transform-runtime", {
      //     "absoluteRuntime": false,
      //     "corejs": 2, // 还需要npm i @babel/runtime-corejs2 --save
      //     "helpers": true,
      //     "regenerator": true,
      //     "useESModules": false
      //   }]]
      // }
    }, {
      test: /\.(jpg|png|gif)$/,
      use: {
        //使用url-loader需下载file-loader
        //url-loader 会将图片文件转成base64,并加到js中
        loader: 'url-loader',
        options: {
          name: '[name]_[hash].[ext]',
          outputPath: 'images/',
          //如果设置了limit,当小于limit数值的时候才会转成base64
          //如果不设置limit参数,则和file-loader一样,直接将文件复制到dist目录下
          limit: 8192
        }
      }
    }, {
      // 打包字体文件
      test: /\.(eot|ttf|svg|woff)$/,
      use: {
        // file-loader会将匹配的文件,从src复制到dist下
        loader: 'file-loader',
      }
    }]
  },
  // 插件: 可以在webpack运行到某个时刻的时候,帮你做一些事情(类似生命周期函数)
  plugins: [
    // 会在打包结束后自动生成html,并将生成的js自动引入到这个html中
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 每次打包之前,会自动删除输出文件夹(此时为dist)下的所有文件
    new CleanWebpackPlugin(),
	],
	
  optimization: {
		// 对于老版本的webpack, 在打包时代码无变化, 但contenthash改变, 需要以下配置
		// 这样会多生成一个runtime.js文件, 该文件是manifest关联代码
		// 新版本配置了runtimeChunk, 也是没有问题的
		runtimeChunk: {
			name: 'runtime'
		},

		// (Tree Shaking)为了将入口js文件的import按需进行引入,可以缩小打包文件大小,使用optimization配置,并在package.json文件中配上sideEffects配置
  	// 当mode: 'production'时,optimization配置不用写
    usedExports: true,

    // 自动实现 Code Splitting, 代码分割打包(公共类库等)
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					name: 'vendors',
				},
      }
    },
    // splitChunks: {
    //   chunks: 'async',
    // async只对异步代码生效(默认), all对同步异步都有效, initial只对同步有效
    // 但是同步的时候, 还需要配置cacheGroups
    //   minSize: 30000, // 30kb
    // 需要做代码分割的模块是否大于30000, 即模块内容最小需要到达30000b时, 才做代码分割
    //   maxSize: 0,
    // 当代码分割之后, 生成的js文件大小大于maxSize的设定值时, 会试图再次进行代码分割
    //   minChunks: 1,
    // 当有可能进行代码分割的模块, 被引入1次(大于等于minChunks值), 才会进行代码分割
    //   maxAsyncRequests: 5,
    // 同时加载的模块数, 最多是5个
    //   maxInitialRequests: 3,
    // 整个网站首页(入口文件)进行加载的时候, 最多只能引入3个js, 超出的不在进行代码分割
    //   automaticNameDelimiter: '~',
    // 文件生成的时候, 组与文件名的连接符是'~'
    //   automaticNameMaxLength: 30,
    // 文件名的最长长度为30
    //   name: true,
    // 代码分割后, 取名有效
    //   cacheGroups: {
    // 决定我需要分割的代码, 放在哪个组下
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    // 如果模块在node_modules中, 才做代码分割(放在vendors组下)
    //       priority: -10,
    //       filename: 'vendors.js',
    //     },
    // vendors~main.js
    // 属于vendors组, 并且从main.js中引入的
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    // 同时满足多个组的时候, 到底放哪个组, 由priority值决定, 值越大, 优先级越大
    //       reuseExistingChunk: true
    // 如果一个模块被打包过, 那就忽略它, 并使用之前那个已经打包过得模块
    //     }
    //   }
    // }
	},
	
	// 打包时取消性能警告
	performance: false,
}

/**
 * webpack与react
 * 1.安装npm install --save-dev @babel/preset-react
 * 2.index.js入口文件引入@babel/polyfill(需npm下载安装)
 * 3..babelrc中使用打包业务代码的配置
 *      presets: [['@babel/preset-env', {
          targets: {
            edge: "17",
            firefox: "60",
            chrome: "67",
            safari: "11.1",
          },
          useBuiltIns: 'usage'
        }]]
 * 4.安装npm install react react-dom --sava React框架对应的内容
 * 5.入口文件中
 *    //引入
      import React, {Component} from 'react'
      import ReactDom from 'react-dom'
      //创建react实例APP,书写render语法
      class App extends Component {
        render(){
          return <div>Hello World</div>
        }
      }
      //将APP组件放入html的#root中
      ReactDom.render(<App />, document.getElementById('root'))
 * 6..babel中再加入一个preset,["@babel/preset-react"]
 * 7.再打包就不报错了
 */