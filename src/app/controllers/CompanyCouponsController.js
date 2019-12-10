import CompanyCoupons from "../models/CompanyCoupons";

class CompanyCouponsController {
  async store(req, res) {
    const { id, company_id, points } = await CompanyCoupons.create(req.body);

    return res.json({
      id,
      company_id,
      points
    });
  }
}

export default new CompanyCouponsController();
