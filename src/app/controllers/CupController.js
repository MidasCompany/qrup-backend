const Cup = require('../models/Cup');
const User = require('../models/User');
const File = require('../models/File');

class CupController {
	async store(req, res) {
		const{
			description,
			qr
		} = req.body;

		const user = req.user;

		const CupEx = await Cup.findOne({
			where: { qr },
		});

		if (!CupEx) return res.status(400).json({ error: 'Cup not already resgistered' });

		CupEx.user_id = user.id;
		CupEx.description = description;
		CupEx.enabled = true;

		await CupEx.save();

		return res.json(CupEx);
	}

	async index(req, res) {
		const cups = await Cup.findAll({
			where: {
				user_id: req.user.id,
			},
			order: ['updated_at'],
		});

		if (!cups) {
			return res.status(400).json({ error: 'No cups registered' });
		}

		return res.json(cups);
	}

	async delete(req, res) {
		const cup = await Cup.findOne({
			where: {
				qr: req.params.qr,
				user_id: req.user.id,
				enabled: true
			}, 
		});
		if (!cup) {
			return res.status(400).json({ error: 'Cup not registered' });
		}

		await cup.destroy();

		return res.json({
			message: 'Successfully deleted',
		});
	}
}

module.exports = new CupController();
