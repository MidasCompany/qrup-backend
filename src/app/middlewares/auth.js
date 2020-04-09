const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const User = require('../models/User');
const Employee = require('../models/Employee');

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: 'Token not provided' });
	}

	const [, token] = authHeader.split(' ');

	try {
		const decoded = jwt.verify(token, authConfig.secret);
		
		let data = null;

		if(decoded.type === 'user'){
			data = await User.findOne({
				where: {
					id: decoded.id
				}
			});
		} else if(decoded.type === 'employee'){
			data = await Employee.findOne({
				where: {
					id: decoded
				} 
			});
		}
		
		if(!data) return res.json({ error: type + ' not found'})
	
		req[decoded.type] = data;
		
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Token invalid' });
	}
};
