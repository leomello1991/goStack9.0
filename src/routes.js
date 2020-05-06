import { Router } from 'express';
import multer from 'multer';

// importa minhas configuraççoes
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/authMiddleware';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentsController from './app/controllers/AppointmentsController';
import AgendaController from './app/controllers/AgendaController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from "./app/controllers/AvailableController";

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentsController.store);
routes.get('/appointments', AppointmentsController.index);
routes.delete('/appointments/:id', AppointmentsController.delete);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post('/agenda', AgendaController.index);

routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);
export default routes;
