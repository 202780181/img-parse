
// eslint-disable-next-line strict
const Service = require('egg').Service;


class homeService extends Service {
  async index() {
    return 'static source info';
  }
}

module.exports = homeService;
