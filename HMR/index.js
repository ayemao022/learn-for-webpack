// import './style.css'

// var btn = document.createElement('button');
// btn.innerHTML = '新增';
// document.body.appendChild(btn);

// btn.onclick = function () {
//   var div = document.createElement('div');
//   div.innerHTML = 'item';
//   document.body.appendChild(div);
// }

import counter from './counter';
import number from './number';

counter();
number();

// 当使用了HRM热模块更新后,可以监控某个文件是否发生变化
if(module.hot){
  // 当某个文件(第一参数指定)发生变化时,执行回调函数(第二参数)
  module.hot.accept('./number', () => {
    // 但如果直接调用number(),则之前的div还会存在,就不符合需要的逻辑(只更新更改的模块)
    document.body.removeChild(document.getElementById('number'));
    number();
  })
}