'use strict';

/**
 * 路由
 * @param {Egg.Application} app - 当前应用的实例
 * @author Aaron
 */
module.exports = app => {
  const { router, controller } = app;
	const { home, parse } = controller;
	
  router.get('/', home.index);
  router.post('/api/parse', parse.info);
  router.get('/test/upload', home.upload);
};
