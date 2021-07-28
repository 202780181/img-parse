
// eslint-disable-next-line strict
const Service = require('egg').Service;
const http = require('http');

class homeService extends Service {
  async index() {
    return http.get('http://localhost:3000/');
  }
}

module.exports = homeService;
