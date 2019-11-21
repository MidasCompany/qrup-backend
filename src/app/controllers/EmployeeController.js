import Employee from '../models/Employee';

class EmployeeController {
  async store(req, res){
    const employeeExists = await Employee.findOne({ where: { cpf : req.body.cpf } });

    if (employeeExists){
      return res.status(400).json({ error: 'Employee already exists' });
    }

    const { id, name, cpf, employee_type, company_id } = await Employee.create(req.body);

    return res.json({
      id, 
      name, 
      cpf, 
      employee_type,
      company_id
    });
  }
}

export default new EmployeeController();