const express = require('express');
const path = require('path');
const morgan = require('morgan');
const routes = require('./routes');
require('dotenv/config');
require('./index');

class App {
	constructor() {
		this.server = express();
		this.server.use(morgan(':method :url :status :response-time ms'));
		this.middlewares();
		this.routes();
		this.server.use('/', (req, res) => {
			res.json({
				status: (process.env.NODE_ENV === 'development') ? process.env : 'ok',
			});
		});
		// this.Database;
	}

	middlewares() {
		this.server.use(express.json());
		this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
	}

	routes() {
		this.server.use(routes);
	}
}

module.exports = new App().server;
