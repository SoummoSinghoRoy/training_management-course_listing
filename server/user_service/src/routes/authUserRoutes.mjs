import express from 'express';

import signupValidation from '../validation/signup_validation.mjs';
import loginValidation from '../validation/login_validation.mjs';
import AuthUserController from '../controller/AuthUserController.mjs';
import Authentication from '../../../shared/middleware/authentication.mjs';

const router = express.Router();
const authController = new AuthUserController();
const authentication = new Authentication();

router.post('/auth/signup', authentication.isNotLoggedIn, signupValidation, authController.signup);
router.post('/auth/login', authentication.isNotLoggedIn, loginValidation, authController.login);
router.put('/auth/edit/:userId', authentication.isLoggedIn, authController.editUser);
router.post('/auth/logout', authentication.isLoggedIn, authController.logout);

export default router;