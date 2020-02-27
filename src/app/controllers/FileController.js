const File = require ('../models/File');
//import User from '../models/User';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async index(req, res) {
    const files = await File.findAll({
      attributes: ['id', 'name', 'path'],

    });

    if (files < 1){
      return res.status(400).json({ error: 'No files registered' });
    }
    
    return res.json(files);
  }
}
module.exports = new FileController();