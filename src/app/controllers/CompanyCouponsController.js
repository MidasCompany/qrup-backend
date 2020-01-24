import CompanyCoupons from '../models/CompanyCoupons';
import Company from '../models/Company';

class CompanyCouponsController {
  async store(req, res){

    const { id, company_id, points } = await CompanyCoupons.create(req.body);

    return res.json({
      id, 
      company_id,
      points
    });
  }

  async index(req, res){
    const coupons = await CompanyCoupons.findAll({
      attributes: ['id', 'company_id', 'points'],
      include: [Company],
    });

    if (coupons < 1){
      return res.status(400).json({ error: 'No coupons registered' });
    }

    return res.json(coupons)
  }
}

export default new CompanyCouponsController();