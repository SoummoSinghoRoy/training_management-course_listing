import express from 'express';

import signupValidation from '../validation/auth/signup_validation.mjs';
import loginValidation from '../validation/auth/login_validation.mjs';
import editValidation from '../validation/auth/edit_validation.mjs';
import AuthUserController from '../controllers/AuthUserController.mjs';
import Authentication from '../../middlewares/Authentication.mjs';

const router = express.Router();
const authController = new AuthUserController();
const authentication = new Authentication();

router.post('/signup', authentication.isNotLoggedIn, signupValidation, authController.signup);
router.post('/login', authentication.isNotLoggedIn, loginValidation, authController.login);
router.put('/edit/:userId', authentication.isLoggedIn, editValidation, authController.editUser);
router.post('/logout', authentication.isLoggedIn, authController.logout);

export default router;