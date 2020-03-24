const Cup = require('../models/Cup');
const User = require('../models/User');
const Employee = require('../models/Employee');
const UserPoints = require('../models/UserPoints');
const CompanyCoupons = require('../models/CompanyCoupons');

class PointsController {
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

		async function AddPoints(){
			try {
				await points.update({ total: points.total + 1 }); //Adiciona 1 ponto por leitura
			} catch (err) {
				return res.status(400).json({ error: 'Cant add to total' });
			}
		}
		async function SubPoints(){
			const TotalPoints = points.total;
			//const value = CompanyCoupons.findByPk()

			if (TotalPoints < CompanyCoupons.points){
				return res.status(400).json({error: 'You dont have enough points'});
			} 
			else{
				try {
					await points.update({ total: points.total - CompanyCoupons.points }); 
				} catch (err) {
					return res.status(400).json({ error: 'Cant take from total' });
				}
			}
		}

		const { type } = req.body;

		if (type === 'read'){
			AddPoints();
		}
		else if(type === 'take'){
			SubPoints();
		}
		else{
			return res.status(400).json({error: 'Type must be defined'});
		}

		return res.json({
			employee_id: req.employee_id,
			qr_cup,
			points,
			type
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

module.exports = new PointsController();
