import express from 'express';
const router = express.Router();

import signupValidation from '../validation/signup_validation.mjs';
import loginValidation from '../validation/login_validation.mjs';
import AuthUserController from '../controller/auth_user_controller.mjs';

const authController = new AuthUserController();

router.post('/auth/signup', signupValidation, authController.signup);
router.post('/auth/login', loginValidation, authController.login);
router.put('/auth/edit/:userId');
router.post('/auth/logout');

export default router;