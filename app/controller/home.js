'use strict';

// issue https://zhuanlan.zhihu.com/p/88206694

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const {	ctx	} = this;
		ctx.redirect(`http://47.243.197.199:4000`);
		// ctx.body = await service.home.index();
	}

	/**
	 * http request API
	 * mounted request
	 */
	async upload() {
		const {
			ctx
		} = this;
		await ctx.render('multipart/upload');
	}
}

module.exports = HomeController;