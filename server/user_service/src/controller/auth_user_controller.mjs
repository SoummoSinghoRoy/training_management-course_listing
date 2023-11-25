import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../../../shared/db/db_config.mjs';
import authValidationResult from '../utils/authValidationResult.mjs';
import env_variable from '../../../shared/env_config/custom_env_config.mjs';

class AuthUserController {
  signup = async (req, res) => {
    const { username, email, password } = req.body;
    await authValidationResult(req, res);
    try {
      const retrieve_user = await new Promise((resolve, reject) => {
        const user_checking_query = `SELECT username, email FROM users WHERE username = ? OR email = ?`;
        db.query(user_checking_query, [username, email], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      })
      if (retrieve_user.length === 0) {
        const signup_result = await new Promise(async (resolve, reject) => {
          const signup_query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
          const hashedpassword = await bcrypt.hash(password, 10);
          db.query(signup_query, [username, email, hashedpassword], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results)
          })
        })

        const signedup_user = await new Promise((resolve, reject) => {
          const user_retrieve_query = `SELECT username, email FROM users WHERE id = ?`;
          db.query(user_retrieve_query, [signup_result.insertId], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results[0])
          })
        })
        return res.status(200).json({
          message: 'Signup successfully',
          signup_user: signedup_user
        })
      } else {
        return res.status(422).json({
          message: `User already exist`,
          signup_user: null
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  };
  login = async (req, res) => {
    const { email, password } = req.body;
    await authValidationResult(req, res);
    try {
      const valid_user = await new Promise(async (resolve, reject) => {
        const user_retrieve_query = `SELECT * FROM users WHERE email = ?`;
        db.query(user_retrieve_query, [email], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      })
      if (valid_user.length === 1) {
        const passwordmatched = await bcrypt.compare(password, valid_user[0].password);
        if(passwordmatched) {
          jwt.sign({
            id: valid_user[0].id,
            username: valid_user[0].username,
            email: valid_user[0].email
          }, env_variable.secret_key, {expiresIn: '12h'}, (err, token) => {
            if(err) {
              console.log(err);
              return res.status(500).json({
                message: `Internal server error`
              }) 
            }
            res.cookie('auth_token', 'Bearer ' + token, {expires: new Date(Date.now() + 12 * 3600000)})
            return res.status(200).json({
              message: `Successfully loggedin`,
              authorization: true
            })
          })
        } else {
          return res.status(422).json({
            message: `Password not correct`,
            authorization: false
          })
        }
      } else {
        return res.status(422).json({
          message: `Email not correct`,
          authorization: false
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  }
}

export default AuthUserController;