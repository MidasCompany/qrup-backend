const Yup = require('yup');
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const File = require('../models/File');
const { validate } = require('cnpj');
const { Op } = require('sequelize');;
class CompanyController {
	async store(req, res) {
		const schemaCreateCompany = Yup.object().shape({
			name: Yup.string().required(),
			address: Yup.string().required(),
			cnpj: Yup.string().min(14).required(),
			password: Yup.string().min(3).required(),
			contact: Yup.string().default('0000000'),
			representative: Yup.string().default('')
		});

		let isValid = null;
		try {
			isValid = await schemaCreateCompany.validate(req.body, { abortEarly: false});
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			cnpj,
		} = isValid;

		const validcnpj = validate(cnpj);

		if(!validcnpj) return res.status(400).json({ error: 'Cnpj invalid'});

		const companyExists = await Company.findOne({ 
			where: { 
				cnpj 
			} 
		});

		if (companyExists) return res.status(400).json({ error: 'Company already exists' });

		const company = await Company.create(isValid);

		return res.json(company);
	}

	async update(req, res) {
		
		const {
		} = await Company.update(req.body, {
			where: {id: req.params.company_id}
		});

		return res.json({ ok : "brabo"});
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
