//const Yup = require('yup');
const UserCoupons = require('../models/UserCoupons');
const Company = require('../models/Company');
const CompanyCoupons = require('../models/CompanyCoupons');

class UserCouponsController {
	async store(req, res) {
		const { id, user_id, coupom_id } = await UserCoupons.create(req.body);

		return res.json({
			id,
			user_id,
			coupom_id,
		});
	}

	async index(req, res) {
		const coupons = await CompanyCoupons.findAll({
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

module.exports = new UserCouponsController();
