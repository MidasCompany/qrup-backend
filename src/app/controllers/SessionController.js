const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');
const authConfig = require('../../config/auth');

class SessionController {
	async store(req, res) {
		const schemaEmail = Yup.object().shape({
			email: Yup.string().email().required(),
		});

		if (!(await schemaEmail.isValid(req.body))) {
			return res.status(400).json({ error: 'Email Required' });
		}
		//-----------------------------------------------------------------------------
		const schemaPassword = Yup.object().shape({
			password: Yup.string().required(),
		});

		if (!(await schemaPassword.isValid(req.body))) {
			return res.status(400).json({ error: 'Password Required' });
		}

		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		if (!(await user.checkPassword(password))) {
			return res.status(401).json({ error: 'Password does not match' });
		}

		const { id, name } = user;

		return res.json({
			user: {
				id,
				name,
				email,
			},
			token: jwt.sign({ id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

module.exports = new SessionController();
