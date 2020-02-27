const jwt = require ('jsonwebtoken'); 
const Employee = require ('../models/Employee');
const authConfig = require ('../../config/auth');
const Yup = require ('yup');

class CompanySessionController {
  async store(req, res) {
      const schemaCpf = Yup.object().shape({
        cpf: Yup.string().required(),
      });
  
      if (!(await schemaCpf.isValid(req.body))) {
        return res.status(400).json({ error: 'Email Required' });
      }
//-----------------------------------------------------------------------------
      const schemaPassword = Yup.object().shape({
        password: Yup.string().required(),
      });
  
      if (!(await schemaPassword.isValid(req.body))) {
        return res.status(400).json({ error: 'Password Required' });
      }

    const { cpf, password } = req.body;
    const employee = await Employee.findOne({ where: { cpf } });

    if (!employee){
      return res.status(401).json({ error: 'Employee not found' });
    }

    if (!(await employee.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, employee_type} = employee;

    return res.json({
      employee: {
        id,
        name,
        employee_type,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }), 
    })
  }
}

module.exports = new CompanySessionController();