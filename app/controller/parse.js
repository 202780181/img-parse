'use strict';

// eslint-disable-next-line strict
const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');

/* control class */
class ImageParse extends Controller {
  async info() {
    console.log('接受请求======>');
    const { ctx, service } = this;
    const parts = ctx.multipart();
    let part;
    const param = {};
    while ((part = await parts()) != null) {
      if (part.length) {
      	  param[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }
        /* stream-wormhole 消费 stream 否则会导致while 任务卡顿 */
        await sendToWormhole(part);
        param.file = part;
      }
    }

    console.log('参数解析完毕！');
    const res = await service.parse.compress(param);
    ctx.body = res;
  }
}

module.exports = ImageParse;
