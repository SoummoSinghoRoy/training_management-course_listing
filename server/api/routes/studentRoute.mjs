import express from 'express';

import add_studentValidation from '../validation/student/add_studentValidation.mjs';
import edit_studentValidation from '../validation/student/edit_studentValidation.mjs';
import StudentController from '../controllers/StudentController.mjs';
import Authentication from '../../middlewares/Authentication.mjs';

const router = express.Router();
const studentController = new StudentController();
const authentication = new Authentication();

router.post('/create', authentication.isLoggedIn, add_studentValidation, studentController.create);
router.get('/all', authentication.isLoggedIn, studentController.getAllStudent);
router.get('/single/:studentId', authentication.isLoggedIn, studentController.getSingleStudent);
router.put('/edit/:studentId', authentication.isLoggedIn, edit_studentValidation, studentController.editStudent);
router.delete('/delete/:studentId', authentication.isLoggedIn, studentController.delete);

export default router;