import express from 'express';

import uploads from './upload';
import jwtAuth from './auth';
import AuthController from '@controllers/AuthController';
import GuideController from '@controllers/GuideController';
import RatingController from '@controllers/RatingController';
import HomeController from '@controllers/HomeController';
import ProfileController from '@controllers/ProfileController';

const authController = new AuthController();
const guideController = new GuideController();
const ratingController = new RatingController();
const homeController = new HomeController();
const profileController = new ProfileController();

const auth = jwtAuth();
const routes = express.Router();

//Auth
routes.post('/login', authController.login);
routes.post('/register', uploads.single('avatar') ,authController.register);
routes.post('/forgot_password', authController.forgot_password);
routes.post('/recover', authController.recover_password);

//Guides
routes.post('/guides', auth.authenticate(), guideController.store);
routes.get('/guides', guideController.index);
routes.get('/search_guide', guideController.search);
routes.put('/guides/:id', auth.authenticate(), guideController.update);
routes.delete('/guides/:id', auth.authenticate(), guideController.destroy);

//Rating
routes.post('/rating/:id', auth.authenticate(), ratingController.store);
routes.get('/rating', ratingController.index);

//Home
routes.get('/ranking', homeController.ranking);
routes.get('/recent', homeController.recent);
routes.get('/interests', auth.authenticate(), homeController.interests);

//Profile
routes.get('/profile', auth.authenticate(), profileController.index);
routes.put('/profile/:id', auth.authenticate(), uploads.single('avatar'), profileController.update);

export default routes;