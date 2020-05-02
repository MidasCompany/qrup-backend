const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');
const UserPoints = require('../models/UserPoints');
const Employee = require('../models/Employee');
const authConfig = require('../../config/auth');
const Company = require('../models/Company');
const CompanyEmployee = require('../models/CompanyEmployee');

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

		let isValid = null;

		try {
			isValid = await schemaSession.validate(req.body, { abortEarly: false});
		} catch( err ) {
			return res.status(400).json({ error: err.errors });
		}

		const { email, password, cpf, type } = isValid;

		let data = null;

		if(type === 'user') {
			data = await User.findOne({ 
				where: { 
					email 
				},
				include:[
					{
						model: UserPoints,
						as: 'points'
					}
				]
			});
	
			if (!data) return res.status(401).json({ error: 'User not found' });
	
			if (!(await data.checkPassword(password))) {
				return res.status(401).json({ error: 'Password does not match' });
			}

		} else if(type == 'employee') {
			data = await Employee.findOne({ 
				where: { 
					cpf 
				},
				include:[
					{
						model: CompanyEmployee,
						as: 'company',
						include:[
							{
								model: Company,
								as: 'company'
							}
						]
					}
				]
			});

			if (!data) {
				return res.status(401).json({ error: 'Employee not found' });
			}

			if (!(await data.checkPassword(password))) {
				return res.status(401).json({ error: 'Password does not match' });
			}
		}


		return res.json({
			[type]: data,
			token: jwt.sign({ id: data.id, type }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

module.exports = new SessionController();
