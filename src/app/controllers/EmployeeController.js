const Yup = require('yup');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const CompanyEmployee = require('../models/CompanyEmployee');
const validarCpf = require('validar-cpf');
const {
	Op
} = require('sequelize');

class EmployeeController {
	async store(req, res) {

		const schemaCreateEmployee = Yup.object().shape({
			name: Yup.string().required(),
			cpf: Yup.string().length(11).required(),
			password: Yup.string().min(3).required(),
			role: Yup.number().required()
		});

		let isValid = null;
		try {
			isValid = await schemaCreateEmployee.validate(req.body, { abortEarly: false});
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			cpf,
			name, 
			role,
			password
		} = isValid;

		const validcpf = validarCpf(cpf);

		if(!validcpf) return res.status(400).json('CPF invalid');

		if(req.employee.role != 1) return res.json({ error: 'Employee not admin'});

		Employee.findOrCreate({
			where: {
				cpf
			},
			defaults: {
				name,
				password_temp: password,
				role,
			}
		}).spread(async (user, created) => {

			let temp = await CompanyEmployee.findOne({
				where: {
					company_id: req.params.company_id,
					employee_id: user.id,
				}
			}) 
			if(!temp){
				await CompanyEmployee.create({
				   company_id: req.params.company_id,
				   employee_id: user.id,
			   });
			}
	
			return res.json(user);
		})
	}

	async update(req, res) {

		if(req.employee.role !== 1){
			return res.json({
				status: 'Não ta autorizado cabeça de pica'
			})
		}

		const schema = Yup.object().shape({
			employee_id: Yup.string().required(),
			name: Yup.string(),
			role: Yup.string(),
			password: Yup.string().min(6),
			confirmPassword: Yup.string().min(6),
		});

		let isValid = null;

		try {
			isValid = await schema.validate({ 
				...req.body, 
				employee_id: req.params.employee_id 
			}, { abortEarly: false});
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			name,
			role,
			employee_id,
			oldPassword,
			password,
			confirmPassword
		} = isValid;

		const employee = await Employee.findOne({
			where: {
				id: employee_id
			}
		});

		if(name) employee.name = name;
		if(role) employee.role = role;
		
		if(password && confirmPassword && (password === confirmPassword)) {
			employee.password_temp = password;
		}

		await employee.save();

		res.json(employee.toJSON());
	}

	async index(req, res) {

		if(req.employee.role != 1) return res.json({ error: 'Only managers and owners can list employees'})

		const employees = await CompanyEmployee.findAll({
			where: {
				company_id: req.employee.company.id
			},
			include:[
				{
					model: Employee,
					as: 'employee'
				}
			]
		});

		if (employees < 1) {
			return res.status(400).json({
				error: 'No employees registered',
			});
		}

		return res.json(employees);
	}

	async delete(req, res) {

		if(req.employee.role !== 1){
			return	res.json({
				status: 'não tem permissão corno '
			})
		}

		const employee = await Employee.findOne({
			where: {
				id: req.params.employee_id,
				role: {[Op.not]: 1}
			},
		});

		if (!employee) {
			return res.status(401).json({
				error: 'Você não pode se deletar',
			});
		} else {
			await employee.destroy();
		}

		return res.json({
			message: 'Successfully deleted',
		});
	}
}

module.exports = new EmployeeController();
