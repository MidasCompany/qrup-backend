const Cup = require('../models/Cup');


class AdminController {
	async allCups(req, res) {
		return res.json(await Cup.findAll())
	} 
}

module.exports = new AdminController();