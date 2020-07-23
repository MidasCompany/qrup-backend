const Cup = require('../models/Cup')
const UserPoints = require('../models/UserPoints')
const Company = require('../models/Company')
const CompanyCoupons = require('../models/CompanyCoupons')
const Historic = require('../models/Historic')
const Yup = require('yup')

class CouponController {
  async store (req, res, next) {
    const SchemaCoupon = Yup.object().shape({
      qr: Yup.string().when('type', {
        is: type => type === 'read',
        then: Yup.string().required(),
        otherwise: Yup.string().transform(x => undefined)
      }),
      coupon_and_user: Yup.string().when('type', {
        is: type => type === 'take',
        then: Yup.string().required(),
        otherwise: Yup.string().transform(x => undefined)
      }),
      type: Yup.string().required().oneOf(['read', 'take'])
    })

    let isValid = null

    try {
      isValid = await SchemaCoupon.validate(req.body, { abortEarly: false })
    } catch (err) {

		res.locals.payload = {
			status: 400,
			code: 'validationError',
			body: err.errors
		}
		return next();
    }

    const {
      qr,
      type,
      coupon_and_user
    } = isValid

    if (type === 'read') {
      const qr_cup = await Cup.findOne({
        where: {
          qr
        }
      })

	  if (!qr_cup) {
		  res.locals.payload = {
			  status: 400, 
			  code: 'noCupsRegistered'
		  }
		  return next();
	  }
      const points = await UserPoints.findOne({
        where: { user_id: qr_cup.user_id }
      })

      try {
        points.total = points.total + 1
        await points.save() // Adiciona 1 ponto por leitura
      } catch (err) {
		  res.locals.payload = {
			  status: 400,
			  code: 'addError'
		  }
		  return next();
      }

      await Historic.create({
        user_id: qr_cup.user_id,
        company_id: req.employee.company.id,
        points: 1,
        mode: 'add'
      })

	  res.locals.payload = {
		  status: 200,
		  code: 'addPoints'
	  }
	  return next();

    } else if (type === 'take') {
      const [
        coupon_id,
        user_id
      ] = coupon_and_user.split(',')

      const points = await UserPoints.findOne({
        where: { user_id }
      })

      const coupon = await CompanyCoupons.findOne({
        where: { id: coupon_id }
      })

      if (coupon && points) {
		if (points.total < coupon.points) {
			res.locals.payload = {
				status: 400,
				code: 'noPointsEnough'
			}
			return next();
		}

        points.total = points.total - coupon.points

        await points.save()

        await Historic.create({
          user_id,
          company_id: req.employee.company.id,
          coupon_id: coupon_id,
          points: coupon.points,
          mode: 'rem'
        })

		res.locals.payload = {
			status: 200,
			code: 'pointsRemoved'
		}
		return next();

      }
    } else {
		res.locals.payload = {
			status: 400,
			code: 'noTypeDefined'
		}
		return next();
    }
  }

  async index (req, res, next) {
    const coupons = await CompanyCoupons.findAll({
      include: [{
        model: Company,
        as: 'company'
      }]
    })

    if (coupons < 1) {
      res.locals.payload = {
        status: 400,
		code: 'noCouponsRegistered'
      }
      return next()
    }

    res.locals.payload = {
		status: 200,
		code: '',
		body: coupons
	}
	return next();
  }

  async delete (req, res, next) {
    const coupon_id = req.params.coupon_id
    const company_id = req.params.company_id

    const coupon = await CompanyCoupons.findOne({
      where: {
        id: coupon_id,
        company_id
      }
    })

    await coupon.destroy()

	res.locals.payload = {
		status: 200,
		code: 'couponDeleted'
	}
	return next();
  }
}

module.exports = new CouponController()
