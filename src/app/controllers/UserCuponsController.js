import UserCupons from '../models/UserCupons';

class UserCuponsController {
  async store(req, res){

    const { id, user_id, cupom_id } = await UserCupons.create(req.body);

    return res.json({
      id, 
      user_id,
      cupom_id
    });
  }
}

export default new UserCuponsController();