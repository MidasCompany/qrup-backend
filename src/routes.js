const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../src/config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const CompanyController = require('./app/controllers/CompanyController');
const CupController = require('./app/controllers/CupController');
const EmployeeController = require('./app/controllers/EmployeeController');
const CompanyCouponsController = require('./app/controllers/CompanyCouponsController');
const UserCouponsController = require('./app/controllers/UserCouponsController');
const FileController = require('./app/controllers/FileController');
const AddPointsController = require('./app/controllers/AddPointsController');
const SubPointsController = require('./app/controllers/SubPointsController');
const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/companies', CompanyController.store);
routes.post('/users', UserController.store);
routes.post('/users/:user_id/cups', authMiddleware, CupController.store);
routes.post('/companies/:company_id/employees', EmployeeController.store);
routes.post('/company-coupons', CompanyCouponsController.store);
routes.post('/user-coupons', UserCouponsController.store);
routes.post('/sessions', SessionController.store);
routes.post('/employees/:employee_id/reads', authMiddleware, AddPointsController.store);
routes.post('/employees/:employee_id/takes', authMiddleware, SubPointsController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/users/:user_id', authMiddleware, UserController.index);
routes.get('/companies/:company_id/employees', authMiddleware, EmployeeController.index);
routes.get('/companies', CompanyController.index);
routes.get('/company-coupons', CompanyCouponsController.index);
routes.get('/users/:user_id/cups', CupController.index);
routes.get('/user-coupons', UserCouponsController.index);
routes.get('/reads', AddPointsController.index);
routes.get('/takes', SubPointsController.index);
routes.get('/files', FileController.index);

routes.put('/users', authMiddleware, UserController.update);
routes.put('/employees', authMiddleware, EmployeeController.update);

routes.delete('/employees', authMiddleware, EmployeeController.delete);

module.exports = routes;
