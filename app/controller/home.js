'use strict';

// issue https://zhuanlan.zhihu.com/p/88206694

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const {
			ctx
		} = this;
		await ctx.render('docs/index');
	}

	/**
	 * http request API
	 */
	async upload() {
		const {
			ctx
		} = this;
		await ctx.render('multipart/upload');
	}
}

module.exports = HomeController;