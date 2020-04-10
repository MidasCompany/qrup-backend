const Cup = require('../models/Cup');
const User = require('../models/User');
const Employee = require('../models/Employee');
const UserPoints = require('../models/UserPoints');
const CompanyCoupons = require('../models/CompanyCoupons');
const Yup = require('yup');

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
			
			return res.json({
				employee_id: req.employee_id,
				qr_cup,
				points,
				type
			});
		}
		async function SubPoints(){
			//const TotalPoints = points.total;
			//const value = CompanyCoupons.findByPk()
			const schemaCoupomID = Yup.object().shape({
				coupom_id: Yup.string().required(),
			});
	
			if (!(await schemaCoupomID.isValid(req.body))) {
				return res.status(400).json({ error: 'CoupomID validation fails' });
			}

			const CompanyData = await CompanyCoupons.findOne({
				where: { id: req.body.coupom_id }
			});

			if (CompanyData && points) {
				if(points.total < CompanyData.points) {
					return res.status(400).json({ error: 'You dont have enough points' });
				}
				points.total = points.total - CompanyData.points;

				await points.save();
				return res.status(200).json({ ok: 'brabo' })
			}	
		}

		const { type } = req.body;

		if (type === 'read'){
			await AddPoints();
		}
		else if(type === 'take'){
			await SubPoints();
		}
		else{
			return res.status(400).json({error: 'Type must be defined'});
		}
	}

	async index(req, res) {
		const isUser = await User.findOne({
			where: { id: req.params.user_id },
		});

		if (!isUser) {
			return res.status(400).json({ error: 'Only users can visualize their points' });
		}
		const points = await UserPoints.findAll({
			where : { user_id: isUser.user_id },
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
