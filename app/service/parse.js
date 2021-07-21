
// eslint-disable-next-line strict
const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const pump = require('mz-modules/pump');
const { ImagePool } = require('@squoosh/lib');
const imagePool = new ImagePool();


/* */
class ImageParseService extends Service {
  async compress(param) {
    const { ctx, config } = this;
		const { file, isStream } = param;
    console.log('接受到解析的参数======>');
    console.log(param);
    let result = { file: null };
    if (ctx.get('Content-Type').startsWith('multipart/')) {
      const stream = await ctx.getFileStream();
      console.log('文件流======>');
      console.log(stream);
      const filename = encodeURIComponent(stream.filename);
      const target = path.join(config.baseDir, 'app/public', filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);

      const url = path.resolve(config.baseDir) + '/app/public/' + filename;
      const image = imagePool.ingestImage(url);
      await image.decoded;
      const preprocessOptions = {};
      const encodeOptions = {
        webp: {},
        jxl: {
          quality: 90,
        },
      };
      await image.preprocess(preprocessOptions);
      await image.encode(encodeOptions);
      await imagePool.close();
      const rawEncodedImage = (await image.encodedWith.webp).binary;
      if (isStream) {
        result = {
          file: rawEncodedImage,
        };
      } else {
        const date = new Date().getTime();
        const writeDir = path.join(config.baseDir, 'app/public', `${date}.webp`);
        await fs.writeFile(writeDir, rawEncodedImage, err => {
          if (err) new Error(JSON.stringify(err));
        });
        result = {
          file: `${config.baseDir}app/public${date}.webp`,
        };
      }
    }
    return result;
  }
}

module.exports = ImageParseService;
