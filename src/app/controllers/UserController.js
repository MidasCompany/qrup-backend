import User from '../models/User';

class UserController {
  async store(req, res){
    const userExists = await User.findOne({ where: { email : req.body.email } });

    if (userExists){
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider, cpf, birth, contact, points, cup_id } = await User.create(req.body);

    return res.json({
      id, 
      name, 
      email, 
      provider, 
      cpf, 
      birth, 
      contact,
      points,
      cup_id
    });
  }
}

export default new UserController();