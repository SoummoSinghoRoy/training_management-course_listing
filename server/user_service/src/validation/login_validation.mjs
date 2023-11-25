import { body } from 'express-validator';

const loginValidation = [
  body('email')
    .not().isEmpty().withMessage(`Email can't empty`)
  ,
  body('password')
    .not().isEmpty().withMessage(`Password can't empty`)
];

export default loginValidation;