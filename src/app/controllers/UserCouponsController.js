//const Yup = require('yup');
const UserCoupons = require('../models/UserCoupons');
const User = require('../models/User');
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
		const coupons = await UserCoupons.findAll({
			attributes: ['id'],
			include: [
				{
					model: User,
					attributes: ['name', 'email', 'contact', 'cpf', 'points'],
					as: 'user',
				},
				{
					model: CompanyCoupons,
					attributes: ['id', 'company_id', 'points'],
					as: 'coupom',
				},
			],
		});

		if (coupons < 1) {
			return res.status(400).json({ error: 'No coupons registered' });
		}

		return res.json(coupons);
	}
}

module.exports = new UserCouponsController();
