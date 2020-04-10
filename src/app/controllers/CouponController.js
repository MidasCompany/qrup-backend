const Cup = require('../models/Cup');
const User = require('../models/User');
const Employee = require('../models/Employee');
const UserPoints = require('../models/UserPoints');
const Company = require('../models/Company');
const CompanyCoupons = require('../models/CompanyCoupons');
const Yup = require('yup');

class CouponController {
	async store(req, res) {

		const SchemaCoupon = Yup.object().shape({
			qr: Yup.string().when('type', {
				is: type => type === "read",
				then: Yup.string().required(),
				otherwise: Yup.string().transform(x => undefined)
			}),
			coupon_and_user: Yup.string().when('type', {
				is: type => type === "take",
				then: Yup.string().required(),
				otherwise: Yup.string().transform(x => undefined)
			}),
			type: Yup.string().required().oneOf(['read', 'take']),

		});

		let isValid = null;

		try {
			isValid = await SchemaCoupon.validate(req.body, { abortEarly: false });
		} catch (err) {
			return res.json({
				erro: err.errors
			})
		}

		const {
			qr,
			type,
			coupon_and_user
		} = isValid;

		if (type === 'read') {
			const qr_cup = await Cup.findOne({
				where: {
					qr
				}
			});

			const points = await UserPoints.findOne({
				where: { user_id: qr_cup.user_id },
			});
	
			if (!qr_cup) return res.status(400).json({ error: 'Cup not registered' });

			try {
				points.total = points.total + 1;
				await points.save(); //Adiciona 1 ponto por leitura
			} catch (err) {
				return res.status(400).json({ error: 'Cant add to total' });
			}

			return res.json({ status: 'Points added' });
		}
		else if (type === 'take') {

			let [
				coupon_id,
				user_id
			] = coupon_and_user.split(',');

			const points = await UserPoints.findOne({
				where: { user_id },
			});

			const coupon = await CompanyCoupons.findOne({
				where: { id: coupon_id }
			});

			if (coupon && points) {
				if (points.total < coupon.points) return res.status(400).json({ error: 'You dont have enough points' });

				points.total = points.total - coupon.points;

				await points.save();
				return res.status(200).json({ status: 'Points removed' })
			}
		} else {
			return res.status(400).json({ error: 'Type must be defined' });
		}
	}

	async index(req, res) {
		const coupons = await CompanyCoupons.findAll({
			include: [{
				model: Company,
				as: 'company'
			}],
		});

		if (coupons < 1) {
			return res.status(400).json({ error: 'No coupons registered' });
		}

		return res.json(coupons);
	}
}

module.exports = new CouponController();