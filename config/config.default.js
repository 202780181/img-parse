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

  // add your middleware config here
  config.middleware = [];

	// close csrf security
	config.security = {
		csrf: {
			enable: false,
		}
 }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
