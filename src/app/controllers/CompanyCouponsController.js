import CompanyCoupons from '../models/CompanyCoupons';
import Company from '../models/Company';
import * as Yup from 'yup';

class CompanyCouponsController {
  async store(req, res){
    
    //-------------------------------------------------------------------------------------------
    const schemaCompany = Yup.object().shape({
      company_id: Yup.string().required(),
    });

    if (!(await schemaCompany.isValid(req.body))) {
      return res.status(400).json({ error: 'CompanyID is required' });
    }
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
      include: [
        {
          model: Company,
          attributes: ['name', 'address', 'contact', 'representative'],
        }
      ],
    });

    if (coupons < 1){
      return res.status(400).json({ error: 'No coupons registered' });
    }

    return res.json(coupons)
  }
}

export default new CompanyCouponsController();