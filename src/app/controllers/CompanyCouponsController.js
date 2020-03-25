const Yup = require('yup');
const CompanyCoupons = require('../models/CompanyCoupons');
const Company = require('../models/Company');

class CompanyCouponsController {
	async store(req, res) {
		//-------------------------------------------------------------------------------------------
		const { company_id } = req.params;

		const company = await Company.findByPk(company_id);

		if(!company){
			return res.status(400).json('Company not found');
		}

		req.body.company_id = req.params.company_id;

		const { id, name, description, points } = await CompanyCoupons.create(req.body);

		return res.json({
			id,
			name,
			description,
			points,
			company_id
		});
	}

	async update(req, res) {
		const checkUserNotEmployeeAndManager = await Employee.findOne({
			where: {
				id: req.employee_id,
				employee: false,
				manager: false,
			},
		});

		if (!checkUserNotEmployeeAndManager) {
			return res.status(401).json({
				error: 'Only owners can update coupons',
			});
		}

		const { id, name, description, points } = await CompanyCoupons.update(req.body); 
		
		return res.json({
			id,
			name,
			description,
			points,
			company_id
		});
	}

	async index(req, res) {
		const coupons = await CompanyCoupons.findAll({
			where: { company_id: req.params.company_id },
			attributes: ['id', 'name', 'description', 'points'],
			include: [{
				model: Company,
				attributes: ['name', 'address', 'contact', 'cnpj'],
			}],
		});

		if (coupons < 1) {
			return res.status(400).json({ error: 'No coupons registered' });
		}

		return res.json(coupons);
	}
}

module.exports = new CompanyCouponsController();
