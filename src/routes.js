import { Router } from "express";
import multer from "multer";
import multerConfig from "../src/config/multer";

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';
import CupController from './app/controllers/CupController';
import EmployeeController from './app/controllers/EmployeeController';
import CompanyCouponsController from './app/controllers/CompanyCouponsController';
import UserCouponsController from './app/controllers/UserCouponsController';
import FileController from './app/controllers/FileController';
import CompanySessionController from './app/controllers/CompanySessionController';

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/companies", CompanyController.store);
routes.post("/users", UserController.store);
routes.post("/cups", authMiddleware, CupController.store);
routes.post("/employees", EmployeeController.store);
routes.post("/company-coupons", CompanyCouponsController.store);
routes.post("/user-coupons", UserCouponsController.store);
routes.post("/sessions", SessionController.store);
routes.post("/companysessions", CompanySessionController.store);


routes.post('/files', upload.single('file'), FileController.store);

routes.get('/users', UserController.index);
routes.get('/employees', authMiddleware, EmployeeController.index);
routes.get('/companies', CompanyController.index);
routes.get('/company-coupons', CompanyCouponsController.index);
routes.get('/cups', CupController.index);
routes.get('/user-coupons', UserCouponsController.index);
routes.get('/files', FileController.index);

routes.put("/users", authMiddleware, UserController.update);
routes.put("/employees", authMiddleware, EmployeeController.update);

routes.delete("/employees", authMiddleware, EmployeeController.delete);

export default routes;
