//const Yup = require('yup');
const UserCoupons = require('../models/UserCoupons');
const Company = require('../models/Company');
const CompanyCoupons = require('../models/CompanyCoupons');
const UserPoints = require('../models/UserPoints');
const Yup = require('yup');

class UserCouponsController {
	async store(req, res) {
		const schemaUserID = Yup.object().shape({
			user_id: Yup.string().required(),
		});

		if (!(await schemaUserID.isValid(req.body))) {
			return res.status(400).json({ error: 'UserID validation fails' });
		}
		const schemaCoupomID = Yup.object().shape({
			coupom_id: Yup.string().required(),
		});

		if (!(await schemaCoupomID.isValid(req.body))) {
			return res.status(400).json({ error: 'CoupomID validation fails' });
		}

		const CompanyData = await CompanyCoupons.findOne({
			where: { id: req.body.coupom_id }
		});

		const UserData = await UserPoints.findOne({
			where : { id: req.body.user_id }
		});
		const { user_id, coupom_id } = await UserCoupons.create(req.body);

		return res.json({
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
