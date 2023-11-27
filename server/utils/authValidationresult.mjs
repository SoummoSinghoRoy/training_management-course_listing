import { validationResult } from 'express-validator';

const authValidationResult = (req, res) => {
  const validation_result = validationResult(req).formatWith(err => err.msg);
  if (!validation_result.isEmpty()) {
    return res.status(400).json({
      error: validation_result.mapped()
    })
  } else {
    return true
  }
}

export default authValidationResult;