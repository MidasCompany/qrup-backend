const Historic = require('../models/Historic');
const CompanyCoupons = require('../models/CompanyCoupons');
const Company = require('../models/Company');
const { Op } = require('sequelize');
const moment = require('moment');

class HistoricController {
	async index(req, res) {

		let {
			page,
			limit,
			ini_date,
			end_date,
			user_id,
			company_id
		} = req.query;

		let query = {};
		let where = {};

		

		if (limit) {
			query = {
				limit,
				offset: ((page || 1) - 1) * limit
			}
		}

		if (user_id) {
			where['user_id'] = user_id;
		}

		if (company_id) {
			where['company_id'] = company_id;
		}

		if (ini_date) {
			where['created_at'] = {
				[Op.gte]: new Date(ini_date)
			}
		} else if(end_date) {
			where['created_at'] = {
				[Op.lte]: new Date(end_date)
			}
		} else if(ini_date && end_date) {
			where['created_at'] = {
				[Op.between]: [new Date(ini_date), new Date(end_date)]
			}
		}

		const all_tudo = await Historic.findAndCountAll({
			where,
			include: [
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
				totalPage: Math.ceil(all_tudo.count / limit) || 1,
				totalRow: all_tudo.count
			},
			data: all_tudo.rows
		})
	}
}

module.exports = new HistoricController();
