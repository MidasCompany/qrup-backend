const Cup = require('../models/Cup');
const User = require('../models/User');
const File = require('../models/File');

class CupController {
	async store(req, res) {
		const { user_id } = req.params;

		const user = await User.findByPk(user_id);

		if(!user){
			return res.status(400).json({ error: 'User not found' })
		}

		const CupExists = await Cup.findOne({
			where: { qr: req.body.qr },
		});

		if (CupExists) {
			return res.status(400).json({ error: 'Cup already resgistered' });
		}

		req.body.user_id = req.params.user_id;
		
		const {
			id, description, type, qr
		} = await Cup.create(req.body);

		return res.json({
			id,
			description,
			type,
			qr,
			user_id
		});
	}

	async index(req, res) {
		const cups = await Cup.findAll({
			order: ['type'],
			attributes: ['description', 'type', 'qr'],
			include: [
				{
					model: User,
					attributes: ['name', 'email', 'contact', 'cpf'],
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

	async delete(req, res) {
		
		const {
			qr,
		} = req.body;

		await Cup.destroy({
			where: {
				qr,
			},
		});
		return res.json({
			message: 'Successfully deleted',
		});
	}
}

module.exports = new CupController();
