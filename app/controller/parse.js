'use strict';

const Controller = require('egg').Controller;


/* control class */
/**/
class ImageParse extends Controller {
  async info() {
    const { ctx, service } = this;
    const { file, isFile = false, opt = {} } = ctx.request.body;
    const res = await service.parse.compress(file, isFile, opt)
  }
}

module.exports = ImageParse;
