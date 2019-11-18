// 引入外部库时, 使用以下语法, 并且需要安装 @types/xxxxx, 就可以使用外部库的语法监测
import * as _ from "lodash";

class Greeter {
	greeting: string;
	constructor(message: string) {
		this.greeting = message;
	}
	greet() {
		return _.join(["hello", '', this.greeting], "");
	}
}

let greeter = new Greeter("world");

alert(greeter.greet());