import Company from '../models/Company';

class CompanyController {
  async store(req, res){
    const companyExists = await Company.findOne({ where: { cnpj : req.body.cnpj } });

    if (companyExists){
      return res.status(400).json({ error: 'Company already exists' });
    }

    const { id, name, address, password_hash, contact, cnpj, points, representative } = await Company.create(req.body);

    return res.json({
      id,
      name, 
      address, 
      password_hash, 
      contact, 
      cnpj, 
      points, 
      representative
    });
  }
}

export default new CompanyController();