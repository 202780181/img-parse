// eslint-disable-next-line strict
const Service = require('egg').Service;
const fs = require('fs');

const {
	ImagePool,
} = require('@squoosh/lib');


/* */
class ImageParseService extends Service {
	async compress(fileObj, isStream) {
		const {
			ctx
		} = this;
		isStream = Boolean(isStream);
		const { url } = fileObj;
		const imagePool = new ImagePool();
		let result = {
			file: null,
		};
		if (ctx.get('Content-Type').startsWith('multipart/')) {

			const image = imagePool.ingestImage(url);
			await image.decoded;
			const preprocessOptions = {};
			const encodeOptions = {
				mozjpeg: {},
				jxl: {
					quality: 90,
				},
			};
			await image.preprocess(preprocessOptions);
			await image.encode(encodeOptions);
			const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
			const oldSize = rawEncodedImage.length;
			await imagePool.close();
			if (isStream) {
				result = {
					file: rawEncodedImage.toString(),
					percent: oldSize
				};
			} else {
				result = {
					file: `${fileUrl}`,
				};
			}
		}
		try {
			await fs.unlinkSync(url);
			ctx.logger.info('文件删除成功,删除路径:' + url);
		} catch (err) {
			ctx.logger.error('文件删除失败error:' + err);
		}
		return result;
	}
}

module.exports = ImageParseService;