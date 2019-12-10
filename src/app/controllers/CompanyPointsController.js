import CompanyPoints from "../models/CompanyPoints";

class CompanyPointsController {
  async store(req, res) {
    const { id, company_id, points } = await CompanyPoints.create(req.body);

    return res.json({
      id,
      company_id,
      points
    });
  }

  async index(req,res){

  }

  async show(req,res){
    const {}
  }


}

export default new CompanyPointsController();
