import Cup from '../models/Cup';
import User from '../models/User';
import File from '../models/File';

class CupController {
  async store(req, res){

    const { id, description, type, qr } = await Cup.create(req.body);

    return res.json({
      id, 
      description,
      type,
      qr,
    });
  }

  async index(req, res){
    const cups = await Cup.findAll({
      order: ['type'],
      attributes: ['description', 'type', 'qr'],
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'contact', 'cpf', 'points'],
          include: [
            {
              model: File,
              attributes: ['name', 'path', 'url'],
              as: 'avatar'
            }
          ]
        }
      ],
    });

    if (cups < 1){
      return res.status(400).json({ error: 'No cups registered' });
    }

    return res.json(cups);
  }
}

export default new CupController();