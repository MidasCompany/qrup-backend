const Yup = require('yup');
const User = require('../models/User');
const File = require('../models/File');
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
			return res.json({
				erro: err.errors
			})
		}

		const {
			email,
			cpf,
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

		const user = await User.create(isValid);
		await UserPoints.create({ user_id: user.id });

		return res.json(user)
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
			avatar_id: Yup.string(),
			oldPassword: Yup.string().min(6),
			password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
			confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}
		const { email, oldPassword } = req.body;

		const user = await User.findByPk(req.user_id);

		if (email && email != user.email) {
			const userExists = await User.findOne({ where: { email } });

			if (userExists) {
				return res.status(400).json({ error: 'User already exists' });
			}
		}

		if (oldPassword && !(await user.checkPassword(oldPassword))) {
			return res.status(401).json({ error: 'Password does not match' });
		}

		const {
			id, name, cpf, birth, contact, avatar_id,
		} = await user.update(req.body);

		return res.json({
			id,
			name,
			email,
			cpf,
			birth,
			contact,
			avatar_id,
			points,
		});
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
