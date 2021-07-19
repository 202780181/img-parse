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

// internal url to file stream
const getFileStrem = async (file, isFile) => {
	const source = await task(file, isFile);
	const type = source.split('.')[1];
	console.log('成功回调=======');
	console.log(source);
	const fileStrem = https.get(source, (res)=> {
		var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
		var size = 0;　　 //保存缓冲数据的总长度
		res.on('data', function (chunk) {
			chunks.push(chunk);
			//累加缓冲数据的长度
			size += chunk.length;
		});
		res.on('end', function (err) {
			//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
			var data = Buffer.concat(chunks, size);
			//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
			console.log(Buffer.isBuffer(data));
			//将Buffer对象转换为字符串并以base64编码格式显示
			const base64Img = data.toString('base64');
			//进入终端terminal,然后进入index.js所在的目录，
			return base64Img
		});
	})
	console.log('输出文件=======');
	console.log(fileStrem);

}

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

			ctx.status = status,
			ctx.body = {
				file: source
			}
		} else {
			const {file, isFile = false} = ctx.request.body;
			let fileStrem = await getFileStrem(file, isFile);
			console.log('打印压缩后输出======');
			console.log(fileStrem);
			if(source) {
				ctx.status = status;
				ctx.body = {
					file: fileStrem,
					state: 0
				}
			}
		}
	}
}

module.exports = ImageParse;