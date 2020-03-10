const Cup = require('../models/Cup');
const User = require('../models/User');
const UserPoints = require('../models/UserPoints');

class SubPointsController {
	async store(req, res) {
		const qr_cup = await Cup.findOne({
			where: { qr: req.body.qr },
		});

		if (!qr_cup) {
			return res.status(400).json({ error: 'Cup not registered' });
		}

		const isEmployee = await Employee.findOne({
			where: { id: req.params.employee_id },
		});

		if (!isEmployee) {
			return res.status(400).json({ error: 'Only employees can give checks' });
		}

		const points = await UserPoints.findOne({
			where: { user_id: qr_cup.user_id },
		});
		// VALORES PARA CUPONS DISPONÍVEIS: 5, 10 e 15
		try {
			await points.update({ total: points.total - 5 });
		} catch (err) {
			return res.status(400).json({ error: 'Cant update total' });
		}

		return res.json({
			employee_id: req.employee_id,
			qr_cup,
			points,
		});
	}

	async index(req, res) {
		const points = await UserPoints.findAll({
			order: ['total'],
			include: [
				{
					model: User,
					attributes: ['name', 'email', 'contact', 'cpf'],
				},
			],
		});
		return res.json(points);
	}
}

module.exports = new SubPointsController();
