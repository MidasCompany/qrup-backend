const Historic = require('../models/Historic');
const CompanyCoupons = require('../models/CompanyCoupons');
const Company = require('../models/Company');
class HistoricController {
	async index(req, res) {
		let query = {}
		let limit = 1;
		if(req.query.page){
			limit = req.query.limit || 5;
			query = {
				limit,
				offset: (req.query.page - 1) * limit
			}
		}


		const all_tudo = await Historic.findAndCountAll({
			where: {
				user_id: req.user.id
			},
			include:[
				{
					model: CompanyCoupons,
					as: 'coupon'
				},
				{
					model: Company,
					as: 'company'
				}
			],
			...query
		})
		res.json({
			metadata: {
				totalPage: Math.ceil(all_tudo.count / limit),
				totalRow: all_tudo.count
			},
			data: all_tudo.rows
		})
	}
}

module.exports = new HistoricController();
