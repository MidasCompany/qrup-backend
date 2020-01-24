import Employee from '../models/Employee';
import * as Yup from 'yup';
import Company from '../models/Company';

class EmployeeController {
  async store(req, res){
    const employeeExists = await Employee.findOne({ where: { cpf : req.body.cpf } });

    if (employeeExists){
      return res.status(400).json({ error: 'Employee already exists' });
    }
//------------------------------------------------------------------------------------------------------------
    const schemaName = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schemaName.isValid(req.body))) {
      return res.status(400).json({ error: 'Name validation fails' });
    }
//------------------------------------------------------------------------------------------------------------
    const schemaCpf = Yup.object().shape({
      cpf: Yup.string().required(),
    });

    if (!(await schemaCpf.isValid(req.body))) {
      return res.status(400).json({ error: 'CPF validation fails' });
    }
//------------------------------------------------------------------------------------------------------------
    const schemaType = Yup.object().shape({
      employee_type: Yup.string().required().matches(/(dono|Dono|Gerente|gerente|Empregado|empregado)/),
    });

    if (!(await schemaType.isValid(req.body))) {
      return res.status(400).json({ error: 'Employee type validation fails' });
    }
//------------------------------------------------------------------------------------------------------------
    const schemaCompany = Yup.object().shape({
      company_id: Yup.string().required(),
    });

    if (!(await schemaCompany.isValid(req.body))) {
      return res.status(400).json({ error: 'Company ID validation fails' });
    }
//------------------------------------------------------------------------------------------------------------
    const { id, name, cpf, employee_type, company_id } = await Employee.create(req.body);

    return res.json({
      id, 
      name, 
      cpf, 
      employee_type,
      company_id
    });
  }

  async index(req, res) {
    const employees = await Employee.findAll({
      //where: 
      attributes: ['name', 'cpf', 'employee_type'],
        include: [
          {
          model: Company,
          attributes: ['name', 'address', 'contact', 'cnpj'],
        },
      ],
    })

    if (employees < 1){
      return res.status(400).json({ error: 'No employees registered' });
    }

    return res.json(employees);
  }
}

export default new EmployeeController();