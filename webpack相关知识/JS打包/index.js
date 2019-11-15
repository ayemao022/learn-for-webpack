/* // 第一种方式
// 首次访问页面的时候, 加载main.js => 2Mb(业务+lodash)
// 当业务逻辑发生变化时, 又需要加载 2mb 内容

// 业务逻辑 1Mb
console.log(_.join(['a', 'b'], '***'));

// 第二种方式
// 新建一个lodash.js文件, 将lodash绑定在window上
// main.js被拆成lodash.js(1Mb), main.js(1Mb)
// 当业务逻辑发生变化时, 只需要加载main.js(1Mb), lodash.js在缓存中有(不需要加载)

// Code Splitting(代码拆分) */

// 同步代码
// import _ from 'lodash'; //1Mb
// console.log(_.join(['a', 'b'], '***')); //1Mb

// 当写异步加载组件时, webpack也会去实现代码分割(自动, 不需要写配置)

// 代码分割, 和webpack无关
// webpack中实现代码分割, 两种方式
// 1.同步代码: 只需要在webpack.common.js中做optimization的配置即可
// 2.异步代码(import): 异步代码, 无需做任何配置, 会自动进行代码分割 

// 异步代码
// function getComponent() {
//   return import(/* webpackChunkName:"loadsh" */'lodash').then(({ default: _ }) => {
//     var element = document.createElement('div');
//     element.innerHTML = _.join(['Ye', 'Dong'], '-');
//     return element;
//   })
// }

// document.addEventListener('click', () => {
// 	getComponent().then( element => {
// 		document.body.appendChild(element);
// 	});
// })

// 懒加载概念 通过function, 将import加载作为函数的执行体, 在特定情况下触发函数, 再去加载, 即懒加载
// 懒加载重点在 import语法, 并不是webpack提出的, 而是ES的概念, 想要使用import, 必须使用babel等

// 异步函数
// async function getComponent() {
// 	const { default: _ } = await import(/* webpackChunkName:"loadsh" */'lodash');
//     const element = document.createElement('div');
//     element.innerHTML = _.join(['Ye', 'Dong'], '-');
//     return element;
// }

// document.addEventListener('click', () => {
// 	getComponent().then( element => {
// 		document.body.appendChild(element);
// 	});
// })
// 异步打包后, 会生成两个js文件, 每一个文件都可以叫一个chunk

// async function getComponent() {
// 	const { default: _ } = await import(/* webpackChunkName:"loadsh" */'lodash');
// 	return element;
// }

// document.addEventListener('click', () => {
// 	import(/* webpackPrefetch: true */ './click.js').then(({default: func}) => {
// 		func();
// 	})
// })
// 使用魔法注释 /* webpackPrefetch: true */ 可以在网络空闲的时候就去加载 click.js, 而不一定非要等到点击才去加载
// Prefetch会在核心代码加载完成之后, 再去加载
// Preload会和主文件一起加载, 所以使用Prefetch会更符合首页加载逻辑
// 使用Prefetch 和 Preload 可能会有兼容性问题