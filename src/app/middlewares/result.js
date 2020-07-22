const messages = require('../../config/messages')

module.exports = (req, res) => {
  let msg = ''
  const payload = res.locals.payload

  if (Object.keys(messages).includes(payload.code)) {
    msg = messages[payload.code]
  }

  res.status(payload.status).send({
    code: payload.code,
    msg: msg,
    body: payload.body
  })
}
