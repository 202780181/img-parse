// eslint-disable-next-line strict
const Service = require('egg').Service;
const fs = require('fs');
const { ImagePool } = require('@squoosh/lib');


class ImageParseService extends Service {
	async compress(fileObj, isStream) {
		const { url } = fileObj;
		let result = {file: null};
		isStream = Boolean(isStream);
		const imagePool = new ImagePool();
		const image = imagePool.ingestImage(url);
		await image.decoded;
		const preprocessOptions = {}; 
		const encodeOptions = {
			mozjpeg: 'auto',
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
				file: url,
			};
		}
		fs.unlinkSync(url);
		return result;
	}
}

module.exports = ImageParseService;