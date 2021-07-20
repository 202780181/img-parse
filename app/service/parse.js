'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const Service = require('egg').Service;
const pump = require('mz-modules/pump');
const { ImagePool } = require('@squoosh/lib');
const imagePool = new ImagePool();


/* internal url to file stream */
const getBlob = async (file) => {
  let fileStream = new Promise((resolve) => {
    https.get(file, res => {
      // 二进制
      res.setEncoding('binary');
      let files = '';
      // 加载到内存
      res.on('data', chunk => {
        files += chunk;
      })
        .on('end', () => {
          resolve(files);
        });
    });
  });
  let binaryFiles = await fileStream.then(data => {
    return data;
  });
  return binaryFiles;
};


/* */
class ImageParseService extends Service {
  async compress(file, isStream, opt) {
    const { ctx, config } = this;
    if (ctx.get('Content-Type')
      .startsWith('multipart/')) {
      const stream = await ctx.getFileStream();
      const filename = encodeURIComponent(stream.filename);
      const target = path.join(config.baseDir, 'app/public', filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);

      const url = path.resolve(config.baseDir) + '/app/public/' + filename;
      const image = imagePool.ingestImage(url);
      await image.decoded;
      // eslint-disable-next-line no-empty-pattern
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
      const writeTarget = path.join(config.baseDir, 'app/public', 'image.jpg');
      fs.writeFile(writeTarget, rawEncodedImage, err => {
        if (err) new Error(err);
      });

      // eslint-disable-next-line no-empty
      if (isStream) {

      }
      // ctx.body = image
    }
    // 图片上传
    // eslint-disable-next-line no-empty
    if (file) {

    }
  }
}

module.exports = ImageParseService;
