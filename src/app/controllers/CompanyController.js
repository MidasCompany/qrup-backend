const Yup = require('yup');
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const CompanyEmployee = require('../models/CompanyEmployee');
const { validate } = require('cnpj');
const validarCpf = require('validar-cpf');
const { Op } = require('sequelize');
class CompanyController {
	async store(req, res) {
		const schemaCreateCompany = Yup.object().shape({
			nameCompany: Yup.string().required(),
			address: Yup.string().required(),
			cnpj: Yup.string().min(14).required(),
			contact: Yup.string().default('0000000'),

			nameOwner: Yup.string().default(''),
			cpf: Yup.string().min(11).required(),
			password: Yup.string().min(3).required(),
		});

		let isValid = null;
		try {
			isValid = await schemaCreateCompany.validate(req.body, { abortEarly: false });
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			nameOwner,
			nameCompany,
			password,
			cnpj,
			cpf,
			address,
			contact,
		} = isValid;

		const validcnpj = validate(cnpj);

		if (!validcnpj) return res.status(400).json({ error: 'Cnpj invalid' });

		const validcpf = validarCpf(cpf);

		if (!validcpf) return res.status(400).json('CPF invalid');

		const companyExists = await Company.findOne({
			where: {
				cnpj
			}
		});

		if (companyExists) return res.status(400).json({ error: 'Company already exists' });

		let employee = null;

		Employee.findOrCreate({
			where: {
				cpf
			},
			defaults: {
				name: nameOwner,
				password_temp: password,
				role: 1,
			}
		}).spread(async (user, created) => {
			employee = user;

			const company = await Company.create({
				name: nameCompany,
				address,
				contact,
				cnpj,
			});
	
			
		 	await CompanyEmployee.create({
				company_id: company.id,
				employee_id: employee.id,
				owner: true
			}) 
	
			return res.json(company);
		})

		
	}

	async update(req, res) {

		if(req.employee.role !== 1){
			return res.json({
				status: "You não have Permission aqui"
			})
		}

		const schema = Yup.object().shape({
			name: Yup.string(),
			address: Yup.string(),
			contact: Yup.string()
		});


		let isValid = null;
		try {
			isValid = await schema.validate(req.body, { abortEarly: false });
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			name,
			address,
			contact
		} = isValid;

		const company = await Company.findOne({
			where: {
				id: req.employee.company.id
			}
		});

		if(name)  company.name = name;
		if(address) company.address = address;
		if(contact) company.contact = contact;

		await company.save();

		return res.json(company);
	}

	async index(req, res) {
		const companies = await Company.findAll();

		if (companies < 1) {
			return res.status(400).json({ error: 'No companies registered' });
		}

		return res.json(companies);
	}
}

module.exports = new CompanyController();
