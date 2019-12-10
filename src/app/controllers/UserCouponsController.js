import UserCoupons from "../models/UserCoupons";

class UserCouponsController {
  async store(req, res) {
    const { id, user_id, coupon_id } = await UserCoupons.create(req.body);

    return res.json({
      id,
      user_id,
      coupon_id
    });
  }
}

export default new UserCouponsController();
