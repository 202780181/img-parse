'use strict';

// issue https://zhuanlan.zhihu.com/p/88206694

const Controller = require('egg').Controller;
const path = require('path');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async upload() {
    const { ctx } = this;
    await ctx.render('app.tpl', { title: '自定义渲染' });
  }
}

module.exports = HomeController;
