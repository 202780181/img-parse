'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');

/* control class */
class ImageParse extends Controller {
	async info() {
		const {
			ctx,
			service,
			config,
		} = this;
		const parts = ctx.multipart();
		const param = {};
		let part = null;
		let result = null;
		while ((part = await parts()) != null) {
			if (part.length) {
				ctx.coreLogger.debug('[egg-multipart:storeMultipart] handle value part: %j', part);
				param[part[0]] = part[1];
			} else {
				if (!part.filename) {
					await sendToWormhole(part);
					continue;
				}
				const date = new Date().getTime();
				const filename = encodeURIComponent(part.filename);
				const target = path.join(config.baseDir, 'app/public', date + filename);
				result = await new Promise((resolve, reject) => {
					// 创建文件写入流
					const remoteFileStrem = fs.createWriteStream(target);
					// 以管道方式写入流
					part.pipe(remoteFileStrem);

					let errFlag;
					// 监听error事件
					remoteFileStrem.on('error', err => {
						errFlag = true;
						// 停止写入
						sendToWormhole(part);
						remoteFileStrem.destroy();
						console.log(err);
						reject(err);
					});

					// 监听写入完成事件
					remoteFileStrem.on('finish', () => {
						if (errFlag) return;
						resolve({
							filename,
							size: remoteFileStrem.bytesWritten,
							url: target,
						});
					})
				})
			}
		}

		console.log('参数解析完毕！');
		ctx.logger.info('file writeStream success: ', param);
		ctx.logger.info('file writeStream result: ', result);
		const isStream = param.isFile || true;
		ctx.body = await service.parse.compress(result, isStream);
		// ctx.set('content-Type','application/octet-stream')
	}
}

module.exports = ImageParse;