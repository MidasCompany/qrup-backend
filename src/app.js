const express = require('express')
const morgan = require('morgan')
const routes = require('./app/routes')
require('dotenv/config')
require('./index')

class App {
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    this.server = express()
    this.middlewares()
    this.routes()
    this.server.use('/', (req, res) => {
      res.json({
        status: (process.env.NODE_ENV === 'development') ? process.env : 'ok'
      })
    })
    // this.Database;
  }

  middlewares () {
    this.server.use(express.json())
    this.server.use('/', express.static('public'))
    this.server.use(morgan(':method :url :status :response-time ms'))
  }

  routes () {
    routes(this.server)
  }
}

module.exports = new App().server
