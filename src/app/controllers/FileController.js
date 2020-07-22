const fs = require('fs')
const { join } = require('path')

const Employee = require('../models/Employee')
const Company = require('../models/Company')
class FileController {
  async store (req, res) {
    const role = req.query.role
    const dest = `/uploads/${role}/`
    const ext = '.' + req.file.filename.split('.')[1]
    let new_filename = ''

    if (role === 'user') {
      new_filename = req.user.id + ext
      req.user.avatar_id = dest + new_filename
      await req.user.save()
    } else if (role === 'employee') {
      const employee = await Employee.findOne({
        where: {
          id: req.employee.id
        }
      })
      new_filename = req.employee.id + ext
      employee.avatar_id = dest + new_filename

      await employee.save()
    } else if (role === 'company') {
      if (req.employee.role === 1) {
        const company = await Company.findOne({
          where: {
            id: req.employee.company.id
          }
        })
        new_filename = req.employee.company.id + ext
        company.avatar_id = dest + new_filename
        await company.save()
      } else {
        fs.unlinkSync(join(req.file.path))
        return res.json({
          error: 'Only owners can update logos'
        })
      }
    }

    fs.rename(join(req.file.path), join(req.file.destination, new_filename), function (err) {
      if (err) console.log('ERROR: ' + err)
    })

    return res.json({ status: 'ok' })
  }

  async delete (req, res) {
    const role = req.query.role

    if (role === 'user') {
      if (req.user.avatar_id !== '/uploads/user/default-user.jpg') {
        fs.unlinkSync(join('public', req.user.avatar_id))
        req.user.avatar_id = '/uploads/user/default-user.jpg'
      }
      await req.user.save()
    } else if (role === 'employee') {
      if (req.employee.avatar_id !== '/uploads/employee/default-employee.jpg') {
        fs.unlinkSync(join('public', req.employee.avatar_id))
        req.employee.avatar_id = '/uploads/employee/default-employee.jpg'
      }
      await req.employee.save()
    } else if (role === 'company') {
      if (req.employee.role === 1) {
        if (req.employee.company.avatar_id !== '/uploads/company/default-company.jpg') {
          fs.unlinkSync(join('public', req.employee.company.avatar_id))
          req.employee.company.avatar_id = '/uploads/company/default-company.jpg'
        }
        await req.employee.company.save()
      }
    }

    res.json({ status: 'ok' })
  }
}
module.exports = new FileController()
