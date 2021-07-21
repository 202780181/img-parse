'use strict';

const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');

/* control class */
class ImageParse extends Controller {
  async info() {
    console.log('接受请求======>');
    const { ctx, service, config } = this;
    const parts = ctx.multipart();
		const date = new Date().getTime();
    let part;
    const param = {};
		let target = null;
    while ((part = await parts()) != null) {
      if (part.length) {
      	  param[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }

				const stream = part;
				const filename = encodeURIComponent(stream.filename);
				target = path.join(config.baseDir, 'app/public', date + filename);
				
				/* 以二进制写入否则图片无法显示 */
				const writeStream = fs.createWriteStream(target , {
					flags: 'w',  
					autoClose: true,
					encoding: 'binary'
				});
				await pump(stream, writeStream);
				 /* stream-wormhole 消费 stream 否则会导致while 任务卡顿 */
				await sendToWormhole(part);
      }
    }
	

    console.log('参数解析完毕！');
		console.log(param);
		const isStream = param.stream || false;
    const res = await service.parse.compress(target, isStream);
    ctx.body = res;
  }
}

module.exports = ImageParse;
