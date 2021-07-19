const fs = require('fs');
const https = require('https');
const Controller = require('egg').Controller;
const tinify = require("tinify");
tinify.key = "klrz4JNlbfG4w4MrvBmBh2vcV1X3b92P";
// tinify.proxy = "http://localhost:7001/api/parse";

/* tinify file upload parse */
const task = (url) => {
	const source = tinify.fromUrl(url);
	source.toFile("optimized.jpg");
	return source._url;
}


/* internal url to file stream */
const getBlob = async (file, isFile) => {
	const source = await task(file, isFile);
	const type = source.split('.')[1];
	let fileStream = new Promise((resolve, reject) => {
		https.get(source, res => {
			// 二进制
			res.setEncoding('binary');
			let files = '';
			// 加载到内存
			res.on('data', chunk => {
				files += chunk;
			}).on('end', () => {
				resolve(files);
			})
		})
	})
	let binaryFiles = await fileStream.then(data => {
		return data
	})
	return binaryFiles
}

/* control class */
class ImageParse extends Controller {
	async info() {
		const { ctx, service } = this;
		let status = 200;
		if(this.ctx.get('Content-Type').startsWith('multipart/')) {
			let stream;
			try {
				stream = await ctx.getFileStream();
				console.log('是一个文件');
				console.log(stream);
				console.log(stream.mimeType);
			} catch (err) {
				status = 500;
			}
		} else {
			const {file, isFile = false} = ctx.request.body;
			let fileStream;
			if(isFile) {
				// Blob Object
				fileStream = await getBlob(file, isFile);
			} else {
				// url address
				fileStream = await task(file);
			}
			ctx.status = status;
			ctx.body = {
				file: fileStream,
				state: 0
			}
		}
	}
}

module.exports = ImageParse;
