const Historic = require('../models/Historic');

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
