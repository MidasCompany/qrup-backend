const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Company = require('../models/Company');

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
					id: decoded.id
				},
				include:[
					{
						model: Company,
						as: 'company'
					}
				]
			});
		}
		
		if(!data) return res.json({ error: type + ' not found'})
	
		req[decoded.type] = data;// req.user | req.employee
		
		return next();
	} catch (err) {
		console.log(err)
		return res.status(401).json({ error: 'Token invalid' });
	}
};
