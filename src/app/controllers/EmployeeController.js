const Yup = require('yup');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const File = require('../models/File');
const validarCpf = require('validar-cpf');

class EmployeeController {
	async store(req, res) {
		const { company_id } = req.params;

		const company = await Company.findByPk(company_id);

		if(!company){
			return res.status(400).json('Company not found');
		}

		const employeeExists = await Employee.findOne({
			where: {
				cpf: req.body.cpf,
			},
		});

		if (employeeExists) {
			return res.status(400).json({
				error: 'Employee already exists',
			});
		}
		//------------------------------------------------------------------------------------------------------------
		const schemaName = Yup.object().shape({
			name: Yup.string().required(),
		});

		if (!(await schemaName.isValid(req.body))) {
			return res.status(400).json({
				error: 'Name validation fails',
			});
		}
		//------------------------------------------------------------------------------------------------------------

		const schemaCpf = Yup.object().shape({
			cpf: Yup.string().required(),
		});

		if (!(await schemaCpf.isValid(req.body))) {
			return res.status(400).json({
				error: 'CPF validation fails',
			});
		}
		const validcpf = validarCpf(req.body.cpf);

		if(!validcpf){
		return res.status(400).json('CPF invalid');
		}

		//------------------------------------------------------------------------------------------------------------
		// ------------------------------------------------------------------------------------------------------------

		const {
			id,
			name,
			cpf,
			password,
			owner,
			manager,
			employee
		} = await Employee.create(req.body);

		return res.json({
			id,
			name,
			cpf,
			password,
			owner,
			manager,
			employee,
			company_id
		});
	}

	async update(req, res) {
		const checkUserNotEmployee = await Employee.findOne({
			where: {
				id: req.employee_id,
				employee: false,
			},
		});

		if (!checkUserNotEmployee) {
			return res.status(401).json({
				error: 'Only managers and owners can update employees',
			});
		}
		//= ========================================================================================
		const schema = Yup.object().shape({
			name: Yup.string(),
			avatar_id: Yup.string(),
			oldPassword: Yup.string().min(6),
			password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
			confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({
				error: 'Validation fails',
			});
		}
		const {
			cpf,
			oldPassword,
		} = req.body;

		const employee = await Employee.findByPk(req.employee_id);

		if (cpf && cpf != employee.cpf) {
			const employeeExists = await Employee.findOne({
				where: {
					cpf,
				},
			});

			if (!employeeExists) {
				return res.status(400).json({
					error: 'Employee doenst exists',
				});
			}
		}

		if (oldPassword && !(await employee.checkPassword(oldPassword))) {
			return res.status(401).json({
				error: 'Password does not match',
			});
		}

		const {
			id,
			name,
			password,
			owner,
			manager,
			employee: func,
			avatar_id,
		} = await employee.update(req.body);

		return res.json({
			id,
			name,
			cpf,
			password,
			owner,
			manager,
			func,
			company_id,
			avatar_id,
		});
	}

	async index(req, res) {
		const checkUserNotEmployee = await Employee.findOne({
			where: {
				id: req.employee_id,
				employee: false,
			},
		});

		if (!checkUserNotEmployee) {
			return res.status(401).json({
				error: 'Only managers and owners can list employees',
			});
		}
		const employees = await Employee.findAll({
			// where:
			attributes: ['id', 'name', 'cpf', 'password', 'owner', 'manager', 'employee'],
			include: [{
				model: Company,
				attributes: ['name', 'address', 'contact', 'cnpj'],
			},
			{
				model: File,
				attributes: ['name', 'path', 'url'],
				as: 'avatar',
			},
			],
		});

		if (employees < 1) {
			return res.status(400).json({
				error: 'No employees registered',
			});
		}

		return res.json(employees);
	}

	async delete(req, res) {
		const checkUserOwner = await Employee.findOne({
			where: {
				id: req.employee_id,
				owner: false,
			},
		});

		if (!checkUserOwner) {
			return res.status(401).json({
				error: 'Only owners can delete employees',
			});
		}

		const {
			id,
		} = req.body;

		await Employee.destroy({
			where: {
				id,
			},
		});
		return res.json({
			message: 'Successfully deleted',
		});
	}
}

module.exports = new EmployeeController();
