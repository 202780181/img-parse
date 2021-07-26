// eslint-disable-next-line strict
const Service = require('egg').Service;
const fs = require('fs');

const {
	ImagePool,
} = require('@squoosh/lib');


/* */
class ImageParseService extends Service {
	async compress(fileUrl, isStream) {
		const {
			ctx
		} = this;
		isStream = Boolean(isStream);
		const imagePool = new ImagePool();
		let result = {
			file: null,
		};
		if (ctx.get('Content-Type').startsWith('multipart/')) {

			const image = imagePool.ingestImage(fileUrl);
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
			await imagePool.close();
			if (isStream) {
				result = {
					file: rawEncodedImage,
				};
			} else {
				result = {
					file: `${fileUrl}`,
				};
			}
		}
		try {
			await fs.unlinkSync(fileUrl);
			ctx.logger.info('文件删除成功,删除路径:' + fileUrl);
		} catch (err) {
			ctx.logger.error('文件删除失败error:' + err);
		}
		return result;
	}
}

module.exports = ImageParseService;