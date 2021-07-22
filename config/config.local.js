'use strict';

/* appInfo */
module.exports = () => {
  return {
    logger: {
      dir: '/Users/aaron/logs/image-parse-logs',
    },
    webpack: {
      enable: true,
      package: 'egg-webpack',
      webpackConfigList: require('@easy-team/easywebpack-vue').getWebpackConfig()
    }
  };
};
