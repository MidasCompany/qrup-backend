const { readdirSync } = require('fs')
const path = require('path')
const result = require('../middlewares/result')

const pathRoutes = '../routes'

module.exports = (app) => {
  readdirSync(path.join(__dirname, pathRoutes))
    .filter(fileName => (fileName !== 'index.js') && (fileName.slice(-3) === '.js'))
    .forEach(fileName => {
      const name = '/' + path.basename(fileName)
      console.log(name)
      try {
        const router = require(path.join(__dirname, pathRoutes, name))
        app.use('', router, result)
      } catch (e) {
        console.log(e)
        console.log({
          error: 'Algo de errado na rota: ' + name
        })
      }
    })
}
