import Company from '../models/Company';
import * as Yup from 'yup';
import File from '../models/File';

class CompanyController {
  async store(req, res){
    //-------------------------------------------------------------------------------------------
      const schemaName = Yup.object().shape({
        name: Yup.string().required(),
      });
  
      if (!(await schemaName.isValid(req.body))) {
        return res.status(400).json({ error: 'Name validation fails' });
      }
    //---------------------------------------------------------------------------------------------
    const schemaAddress = Yup.object().shape({
      address: Yup.string().required(),
    });

    if (!(await schemaAddress.isValid(req.body))) {
      return res.status(400).json({ error: 'Address validation fails' });
    }
    //----------------------------------------------------------------------------------------------
    
    function checkCNPJ(str){
      const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
      return regex.test(String(str).toLowerCase());
    }
    
    const schemaCnpj = Yup.object().shape({
      cnpj: Yup.string().required(),
    });

    if (!(await schemaCnpj.isValid(req.body))) {
      return res.status(400).json({ error: 'CNPj validation fails' });
    }

    if (!(await checkCNPJ(req.body.cnpj))){
      return res.status(400).json({ error: 'Invalid CNPj' });
    }

    const companyExists = await Company.findOne({ where: { cnpj : req.body.cnpj } });

    if (companyExists){
      return res.status(400).json({ error: 'Company already exists' });
    }

    const { id, name, address, contact, cnpj, representative } = await Company.create(req.body);

    return res.json({
      id,
      name, 
      address, 
      contact, 
      cnpj,
      representative
    });
  }

  async index(req, res){
    const companies = await Company.findAll({
      attributes: ['name', 'address', 'contact', 'cnpj', 'representative'],
        include: {
        model: File,
        attributes: ['name', 'path', 'url'],
        as: 'logo'
      },
    })
    
    if (companies < 1){
      return res.status(400).json({ error: 'No companies registered' });
    }
    
    return res.json(companies);
  } 
}

export default new CompanyController();