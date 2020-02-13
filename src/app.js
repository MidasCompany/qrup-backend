import express from 'express';
import path from 'path';
import routes from './routes';

import Database from './index';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
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

export default new App().server;