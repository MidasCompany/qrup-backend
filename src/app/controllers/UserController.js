const Yup = require('yup');
const User = require('../models/User');
const validarCpf = require('validar-cpf');
const UserPoints = require('../models/UserPoints');
const Historic = require('../models/Historic');
const { Op } = require('sequelize');

class UserController {
	async store(req, res) {
		const schemaUserStore = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string().email().required(),
			cpf: Yup.string().length(11).required(),
			password: Yup.string().min(4).required(),
			birth: Yup.date().required(),
			contact: Yup.string().default('00000000')
		});

		let isValid = null;
		try {
			isValid = await schemaUserStore.validate(req.body, { abortEarly: false});
		} catch (err) {
			return res.status(400).json({
				erro: err.errors
			})
		}

		const {
			name,
			email,
			cpf,
			password,
			birth,
			contact
		} = isValid;

		const validcpf = validarCpf(cpf);

		if (!validcpf) {
			return res.status(400).json({ error: 'CPF invalid' });
		}

		const userExists = await User.findOne({ 
			where: {
				[Op.or]: [
					{ email },
					{ cpf }
				]
			}
		});

		if(userExists) return res.json({ error: 'User already exists'});

		const user = await User.create({
			name,
			email,
			cpf,
			password_temp: password,
			birth,
			contact
		});
		await UserPoints.create({ user_id: user.id });

		return res.json(user)
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
			contact: Yup.string(),
			oldPassword: Yup.string().min(3),
			password: Yup.string().min(3).when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
			confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
		});

		let isValid = null;
		try{
			isValid = await schema.validate(req.body, { abortEarly: false});
		}catch(err){
			return res.json({
				erro: err.errors
			})
		}
		
		const { 
			email, 
			name,
			oldPassword,
			password,
			contact
		} = isValid;

		let user = req.user;

		if (email && email != user.email) {
			user.email = email;
		}

		if(name && name != user.name){
			user.name = name;
		}

		if(contact && contact != user.contact){
			user.contact = contact;
		}

		if (oldPassword && await user.checkPassword(oldPassword)) {
			user.password_temp = password
		} else if(oldPassword){
			return res.status(401).json({ error: 'Password does not match' });
		}

		await user.save();

		return res.json(user);
	}

	async index(req, res) {
		const users = await User.findOne({
			where: { id: req.params.user_id },
			include: [
				{
					model: UserPoints,
					as: 'points',
				},
			],
		});

		if (users < 1) {
			return res.status(400).json({ error: 'No users registered' });
		}

		return res.json(users);
	}
}

module.exports = new UserController();
