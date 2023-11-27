import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import db from '../../config/db_config.mjs';
import env_variable from '../../config/custom_env_config.mjs';

class AuthUserController {
  signup = async (req, res) => {
    const validation_result = validationResult(req).formatWith(err => err.msg);
    if (!validation_result.isEmpty()) {
      return res.status(400).json({
        error: validation_result.mapped()
      })
    }
    try {
      const { username, email, password } = req.body;
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
        });
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
    const validation_result = validationResult(req).formatWith(err => err.msg);
    if (!validation_result.isEmpty()) {
      return res.status(400).json({
        error: validation_result.mapped()
      })
    }
    try {
      const { email, password } = req.body;
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
        if (passwordmatched) {
          jwt.sign({
            id: valid_user[0].id,
            username: valid_user[0].username,
            email: valid_user[0].email
          }, env_variable.secret_key, { expiresIn: '12h' }, (err, token) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: `Internal server error`
              })
            }
            res.cookie('auth_token', 'Bearer ' + token, { expires: new Date(Date.now() + 12 * 3600000) })
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
  };
  editUser = async (req, res) => {
    const validation_result = validationResult(req).formatWith(err => err.msg);
    if (!validation_result.isEmpty()) {
      return res.status(400).json({
        error: validation_result.mapped()
      })
    }
    try {
      const { username, email, password } = req.body;
      const { userId } = req.params;
      const id = parseInt(userId);
      if (req.user.id === id) {
        const valid_user = await new Promise((resolve, reject) => {
          const user_retrieve_query = `SELECT * FROM users WHERE id = ?`;
          db.query(user_retrieve_query, [id], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results)
          })
        });
        if (valid_user.length === 1) {
          await new Promise(async (resolve, reject) => {
            const update_query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
            const hashedpassword = await bcrypt.hash(password, 10);
            db.query(update_query,
              [username || valid_user[0].username, email || valid_user[0].email, hashedpassword || valid_user[0].password, id],
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject(err)
                }
                resolve(results)
              }
            )
          });
          const updated_user = await new Promise((resolve, reject) => {
            const user_retrieve_query = `SELECT id, username, email FROM users WHERE id = ?`;
            db.query(user_retrieve_query, [id], (err, results) => {
              if (err) {
                console.log(err);
                reject(err)
              }
              resolve(results[0])
            })
          });
          return res.status(200).json({
            message: `Updated successfully`,
            updated_user
          })
        } else {
          return res.status(422).json({
            message: 'Invalid user'
          })
        }
      } else {
        return res.status(401).json({
          message: 'Unauthorized user',
          authorized: false
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  }
  logout = (req, res) => {
    try {
      res.clearCookie('auth_token')
      return res.status(200).json({
        message: `Loggedout successfully`,
        authorization: false
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  }
}

export default AuthUserController;