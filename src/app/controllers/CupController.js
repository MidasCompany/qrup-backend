import Cup from '../models/Cup';

class CupController {
  async store(req, res){

    const { id, description, type, qr } = await Cup.create(req.body);

    return res.json({
      id, 
      description,
      type,
      qr
    });
  }
}

export default new CupController();