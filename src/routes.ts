import express from 'express';

import uploads from './upload';

import SessionController from './controllers/SessionController';

const sessionController = new SessionController();

const routes = express.Router();

routes.post('/register', uploads.single('avatar') ,sessionController.register);


export default routes;