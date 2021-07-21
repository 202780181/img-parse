
// eslint-disable-next-line strict
const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const pump = require('mz-modules/pump');
const { ImagePool } = require('@squoosh/lib');
const imagePool = new ImagePool();


/* */
class ImageParseService extends Service {
  async compress(dir, isStream) {
    isStream = Boolean(isStream);
    const { ctx, config } = this;
    let result = { file: null };
    if (ctx.get('Content-Type').startsWith('multipart/')) {

      // const filename = encodeURIComponent(stream.filename);
      // const target = path.join(config.baseDir, 'app/public', date + filename);
      // await pump(stream, writeStream);
      console.log('文件位置--------->');
      console.log(dir);

      // const url = path.resolve(config.baseDir) + '/app/public/' + date + filename;
      const image = imagePool.ingestImage(dir);
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
      await imagePool.close();
      const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
      if (isStream) {
        console.log('返回文件流-------->');
        result = {
          file: rawEncodedImage,
        };
      } else {
        result = {
          file: `${dir}`,
        };
      }
    }
    return result;
  }
}

module.exports = ImageParseService;
