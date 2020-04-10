const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../src/config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const CompanyController = require('./app/controllers/CompanyController');
const CupController = require('./app/controllers/CupController');
const EmployeeController = require('./app/controllers/EmployeeController');
const CompanyCouponsController = require('./app/controllers/CompanyCouponsController');
const FileController = require('./app/controllers/FileController');
const CouponController = require('./app/controllers/CouponController');
const authMiddleware = require('./app/middlewares/auth');
const HistoricController = require('./app/controllers/HistoricController');

const adminController = require('./app/controllers/AdminController');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/companies', CompanyController.store);
routes.post('/users', UserController.store);
routes.post('/users/:user_id/cups', authMiddleware, CupController.store);
routes.post('/companies/:company_id/employees', authMiddleware, EmployeeController.store);
routes.post('/companies/:company_id/coupons', authMiddleware, CompanyCouponsController.store);
routes.post('/sessions', SessionController.store);
routes.post('/employees/:employee_id/reads', authMiddleware, CouponController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/users/:user_id', authMiddleware, UserController.index);
routes.get('/companies/:company_id/employees', authMiddleware, EmployeeController.index);
routes.get('/companies', CompanyController.index);
routes.get('/companies/:company_id/company-coupons', CompanyCouponsController.index);
routes.get('/users/:user_id/cups', authMiddleware, CupController.index);
routes.get('/users/:user_id/historic', authMiddleware, HistoricController.index);
routes.get('/coupons', CouponController.index);
routes.get('/files', FileController.index);

routes.put('/users/:user_id', authMiddleware, UserController.update);
routes.put('/companies/:company_id', CompanyController.update);
routes.put('/companies/:company_id/employees', authMiddleware, EmployeeController.update);
routes.put('/companies/:company_id/company-coupons', authMiddleware, CompanyCouponsController.update);

routes.delete('/employees', authMiddleware, EmployeeController.delete);
routes.delete('/users/:user_id/cups/:qr', authMiddleware, CupController.delete);



//Test
routes.get('/allCups',  adminController.allCups);


module.exports = routes;
