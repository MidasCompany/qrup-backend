const Yup = require('yup');
const Company = require('../models/Company');
const File = require('../models/File');
const validarCpf = require('validar-cpf');


class CompanyController {
	async store(req, res) {
		const schemaName = Yup.object().shape({
			name: Yup.string().required(),
		});

		if (!(await schemaName.isValid(req.body))) {
			return res.status(400).json({ error: 'Name validation fails' });
		}
		const schemaAddress = Yup.object().shape({
			address: Yup.string().required(),
		});

		if (!(await schemaAddress.isValid(req.body))) {
			return res.status(400).json({ error: 'Address validation fails' });
		}

		const schemaCnpj = Yup.object().shape({
			cnpj: Yup.string().required(),
		});

		if (!(await schemaCnpj.isValid(req.body))) {
			return res.status(400).json({ error: 'CNPj validation fails' });
		}
		
		const validcnpj = validarCpf(req.body.cnpj);

		if(!validcnpj){
		return res.status(400).json({ error: 'Cnpj invalid'});
		}

		const companyExists = await Company.findOne({ where: { cnpj: req.body.cnpj } });

		if (companyExists) {
			return res.status(400).json({ error: 'Company already exists' });
		}

		const {
			id, name, address, contact, cnpj, representative,
		} = await Company.create(req.body);

		return res.json({
			id,
			name,
			address,
			contact,
			cnpj,
			representative,
		});
	}

	async index(req, res) {
		const companies = await Company.findAll({
			attributes: ['id', 'name', 'address', 'contact', 'cnpj', 'representative'],
			include: {
				model: File,
				attributes: ['name', 'path', 'url'],
				as: 'logo',
			},
		});

		if (companies < 1) {
			return res.status(400).json({ error: 'No companies registered' });
		}

		return res.json(companies);
	}
}

module.exports = new CompanyController();
