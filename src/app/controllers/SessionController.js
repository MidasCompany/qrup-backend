const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');
const UserPoints = require('../models/UserPoints');
const Employee = require('../models/Employee');
const authConfig = require('../../config/auth');

class SessionController {
	async store(req, res) {
		const schemaSession = Yup.object().shape({
			type: Yup.string().required(),
			password: Yup.string().required().min(4),
			email: Yup.string().when('type', {
				is: type => type === 'user',
				then: Yup.string().email().required(),
				otherwise: Yup.string().transform( x => undefined)
			}),
			cpf: Yup.string().when('type', {
				is: type => type === 'employee',
				then: Yup.string().length(11).required(),
				otherwise: Yup.string().transform( x => undefined)
			}),
		});

		let validation = null;

		try {
			validation = await schemaSession.validate(req.body, { abortEarly: false});
		} catch( err ) {
			console.log(err.errors)
			return res.status(400).json({ error: err.errors });
		}

		console.log(validation)


		const { email, password, cpf, type } = req.body;

		const user_email = await User.findOne({where: { email: req.body.email } });
		const points = await UserPoints.findOne({ 
			where: {
			user_id : user_email.user_id,
			},
			attributes: ['total'],
		});

		let data = null;

		if(type === 'user') {
			data = await User.findOne({ 
				where: { email },
				attributes: ['name', 'password_hash', 'email', 'contact', 'cpf'], 
			});
	
			if (!data) {
				return res.status(401).json({ error: 'User not found' });
			}
	
			if (!(await data.checkPassword(password))) {
				return res.status(401).json({ error: 'Password does not match' });
			}

		} else if(type == 'employee') {
			data = await Employee.findOne({ where: { cpf } });

			if (!data) {
				return res.status(401).json({ error: 'Employee not found' });
			}

			if (!(await data.checkPassword(password))) {
				return res.status(401).json({ error: 'Password does not match' });
			}
		}


		return res.json({
			[type]: data, points,
			token: jwt.sign({ id: data.id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

module.exports = new SessionController();
