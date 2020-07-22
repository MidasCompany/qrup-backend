const multer = require('multer')
const crypto = require('crypto')
const { extname, join } = require('path')

module.exports = (multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const role = req.query.role
      cb(null, join('public/uploads/' + role))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err)

        return cb(null, res.toString('hex') + extname(file.originalname))
      })

      // return cb(null, req.user.id + '_temp' + extname(file.originalname));
    }

  }),

  fileFilter: (req, file, cb) => {
    const isAccepted = [
      'image/png',
      'image/jpg',
      'image/jpeg'
      // 'application/octet-stream',
    ]

    console.log(file.mimetype)

    if (isAccepted.includes(file.mimetype)) {
      return cb(null, true)
    }

    return cb(null, false)
  }
}))
