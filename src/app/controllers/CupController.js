const Cup = require('../models/Cup');
const User = require('../models/User');
const File = require('../models/File');

class CupController {
	async store(req, res) {
		const CupExists = await Cup.findOne({
			where: { qr: req.body.qr },
		});

		if (CupExists) {
			return res.status(400).json({ error: 'Cup already resgistered' });
		}

		const {
			id, description, type, qr,
		} = await Cup.create(req.body);
	}

	async index(req, res) {
		const cups = await Cup.findAll({
			order: ['type'],
			attributes: ['description', 'type', 'qr'],
			include: [
				{
					model: User,
					attributes: ['name', 'email', 'contact', 'cpf', 'points'],
					include: [
						{
							model: File,
							attributes: ['name', 'path', 'url'],
							as: 'avatar',
						},
					],
				},
			],
		});

		if (cups < 1) {
			return res.status(400).json({ error: 'No cups registered' });
		}

		return res.json(cups);
	}
}

module.exports = new CupController();
