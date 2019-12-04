import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../src/config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';
import CupController from './app/controllers/CupController';
import EmployeeController from './app/controllers/EmployeeController';
import CompanyCuponsController from './app/controllers/CompanyCuponsController';
import UserCuponsController from './app/controllers/UserCuponsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/companies', CompanyController.store);
routes.post('/users', UserController.store);
routes.post('/cups', CupController.store);
routes.post('/employees', EmployeeController.store);
routes.post('/company-cupons', CompanyCuponsController.store);
routes.post('/user-cupons', UserCuponsController.store);
routes.post('/sessions', SessionController.store);

routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
})

//routes.get('/users', UserController.store);

routes.put('/users', authMiddleware, UserController.update);


export default routes;