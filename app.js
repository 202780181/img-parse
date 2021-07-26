// app.js


class AppBootHook {
	constructor(app) {
		this.app = app;
	}

	// 配置文件启动项
	configWillLoad() {

	}

	// 所有的配置已经加载完毕
	async didLoad() {

	}

	// 所有插件加载完毕
	async willReady() {

	}

	// 应用启动完毕
	async didReady() {
		this.app.logger.info('应用启动完毕')
	}
	// http / https server 已启动，开始接受外部请求
	async serverDidReady() {

	}
}


module.exports = AppBootHook;