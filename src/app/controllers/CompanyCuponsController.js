import CompanyCupons from '../models/CompanyCupons';

class CompanyCuponsController {
  async store(req, res){

    const { id, company_id, points } = await CompanyCupons.create(req.body);

    return res.json({
      id, 
      company_id,
      points
    });
  }
}

export default new CompanyCuponsController();