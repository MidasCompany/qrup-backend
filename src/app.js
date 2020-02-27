require('dotenv/config');

const express = require('express');
const path = require('path');
const routes = require('./routes');

const Database = require('./index');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.server.use('/', (req, res) => {
      res.send(process.env)
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