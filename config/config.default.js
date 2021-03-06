/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
  const config = exports = {

  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1626660796350_6881';

  // ip address proxy
  config.proxy = true;

  // add your middleware config here
  config.middleware = [ 'gzip' ];

  // bodyParser
  config.bodyParser = {
    enable: true,
    jsonLimit: '10mb',
  };

  // add response header gzip
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };
  config.whitelist = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
  ],
  // close csrf security
  config.security = {
    csrf: {
      enable: false,
    },
    // 白名单
    domainWhiteList: [ '*' ],
  };
  // 日志
  config.logger = {
    outputJSON: true,
  };
  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  return {
    ...config,
    ...userConfig,
  };
};
