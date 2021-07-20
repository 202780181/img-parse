const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');
const { ImagePool } = require('@squoosh/lib');
const imagePool = new ImagePool();


/* control class */
/**/
class ImageParse extends Controller {
  async info() {
    const { ctx } = this;
    const { file, isFile = false, opt = {} } = ctx.request.body;
    if (ctx.get('Content-Type').startsWith('multipart/')) {
      const stream = await ctx.getFileStream();
      const filename = encodeURIComponent(stream.filename);
      const target = path.join(this.config.baseDir, 'app/public', filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);

      const url = path.resolve(this.config.baseDir) + '/app/public/' + filename;
      const image = imagePool.ingestImage(url);
      await image.decoded;
      const preprocessOptions = {} = opt;
      await image.preprocess(preprocessOptions);
      const encodeOptions = {
        mozjpeg: {},
        jxl: {
          quality: 90,
        },
      };
      await image.encode(encodeOptions);
      await imagePool.close();
      const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
      const writeTarget = path.join(this.config.baseDir, 'app/public', 'image.jpg');
      fs.writeFile(writeTarget, rawEncodedImage, err => {
        if (err) throw Error(err);
      });

      if (isFile) {

      }
      // ctx.body = image
    }
    // 图片上传
    if (file) {

    }

}

module.exports = ImageParse;
