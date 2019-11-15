// 打包一个库文件
// 还有很多的复杂配置(以下只是基础)

const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	// 本项目打包时, 虽然引用了lodash, 但是打包的时候忽略lodash
	// externals: ['lodash'],
	// externals: {
	// 	lodash: {
	// 		// 表示在不同环境下引入时, 必须使用定义的字符串
	// 		root: '_',
	// 		commonjs: 'lodash'
	// 	}
	// },
	// 一般情况直接这样写就可以了
	externals: 'lodash',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'library.js',
		// 使用script的方式直接引入js, 会在页面的全局变量里添加一个library变量
		library: 'root',
		// 当打包成一个库给别人使用时, 为兼容多种方式引入
		// 'umd' 支持commonJS AMD
		// 'this' 将library绑定在全局 的this上 / 'window'就表示挂载到window上
		libraryTarget: 'umd',
	}
}