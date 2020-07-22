const { Router } = require('express')
const upload = require('../../config/multer')

const UserController = require('../controllers/UserController')
const SessionController = require('../controllers/SessionController')
const CompanyController = require('../controllers/CompanyController')
const CupController = require('../controllers/CupController')
const EmployeeController = require('../controllers/EmployeeController')
const CompanyCouponsController = require('../controllers/CompanyCouponsController')
const FileController = require('../controllers/FileController')
const CouponController = require('../controllers/CouponController')
const authMiddleware = require('../middlewares/auth')
const HistoricController = require('../controllers/HistoricController')

const adminController = require('../controllers/AdminController')

const routes = new Router()

routes.post('/companies', CompanyController.store)
routes.post('/users', UserController.store)
routes.post('/users/:user_id/cups', authMiddleware, CupController.store)
routes.post('/companies/:company_id/employees', authMiddleware, EmployeeController.store)
routes.post('/companies/:company_id/coupons', authMiddleware, CompanyCouponsController.store)
routes.post('/sessions', SessionController.store)
routes.post('/employees/:employee_id/reads', authMiddleware, CouponController.store)

routes.post('/files', authMiddleware, upload.single('file'), FileController.store)

routes.get('/users/:user_id', authMiddleware, UserController.index)
routes.get('/companies/:company_id/employees', authMiddleware, EmployeeController.index)
routes.get('/companies', CompanyController.index)
routes.get('/companies/:company_id/company-coupons', CompanyCouponsController.index)
routes.get('/users/:user_id/cups', authMiddleware, CupController.index)
routes.get('/coupons', CouponController.index)
routes.get('/historic', authMiddleware, HistoricController.index)

routes.put('/users/:user_id', authMiddleware, UserController.update)
routes.put('/companies/:company_id', authMiddleware, CompanyController.update)
routes.put('/companies/:company_id/employees/:employee_id', authMiddleware, EmployeeController.update)
// routes.put('/companies/:company_id/company-coupons', authMiddleware, CompanyCouponsController.update);

routes.delete('/employees/:employee_id', authMiddleware, EmployeeController.delete)
routes.delete('/users/:user_id/cups/:qr', authMiddleware, CupController.delete)
routes.delete('/files', authMiddleware, FileController.delete)
routes.delete('/companies/:company_id/coupons/:coupon_id', authMiddleware, CouponController.delete)

// Test
routes.get('/allCups', adminController.allCups)

module.exports = routes
