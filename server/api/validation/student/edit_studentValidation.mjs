import { body } from 'express-validator';

const edit_studentvalidation = [
  body('full_name')
      .not().isEmpty().withMessage(`Full name can't be ampty`)
      .trim()
  ,
  body('email')
      .not().isEmpty().withMessage(`Email can't be empty`)
      .isEmail().withMessage("Email must be valid")
      .normalizeEmail()
      .trim()
  ,
  body('contact_no')
      .not().isEmpty().withMessage(`Contact no can't be empty`)
      .trim()
  ,
  body('education')
      .not().isEmpty().withMessage(`Education cant' be empty`)
      .trim()
  ,
  body('institute_name')
      .not().isEmpty().withMessage(`Institute name can't be empty`)
      .trim()
  ,
  body('address')
      .not().isEmpty().withMessage(`Address can't be empty`)
      .trim()
];

export default edit_studentvalidation;