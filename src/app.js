if(!process.env.NODE_ENV){
	require('dotenv/config');
}

const express = require('express');
const path = require('path');
const routes = require('./routes');

require('./index');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.server.use('/', (req, res) => {
      res.json({status: 'ok'})
    })
    this.Database;
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes() {
    this.server.use(routes)
  }
}

module.exports = new App().server;