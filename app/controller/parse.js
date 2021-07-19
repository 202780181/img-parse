const Controller = require('egg').Controller;
const tinify = require("tinify");
tinify.key = "klrz4JNlbfG4w4MrvBmBh2vcV1X3b92P";
// tinify.proxy = "http://localhost:7001/api/parse";

class ImageParse extends Controller {
	async info() {
		const { ctx, service } = this;
		if(this.ctx.get('Content-Type').startsWith('multipart/')) {
			let stream;
			try {
				stream = await ctx.getFileStream();
			} catch (err) {
				ctx.body = {
					error: err
				}
			}
			console.log('是一个文件');
			console.log(stream);
			console.log(stream.mimeType);
		} else {
			console.log('打印参数:');
			const {file} = ctx.request.body;
			let source = await tinify.fromUrl(file);
			const result = await source.toFile("optimized.jpg")
			console.log('压缩结果：');
			console.log(result);
			if(source) {
				ctx.body = {
					suucess: source
				}
			}
		}
	}
}

module.exports = ImageParse;