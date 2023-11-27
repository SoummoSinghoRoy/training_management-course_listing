import { body } from 'express-validator';

const edit_validation = [
  body('username')
    .not().isEmpty().withMessage(`User name can't empty`)
    .trim()
  ,
  body('email')
    .not().isEmpty().withMessage(`Email can't empty`)
    .isEmail().withMessage("Email must be valid")
    .normalizeEmail()
    .trim()
  ,
  body('password')
    .not().isEmpty().withMessage(`Password can't empty`)
    .isLength({min: 4, max: 8}).withMessage(`Password length min: 4 and max: 8`)
];

export default edit_validation;