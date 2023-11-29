import { validationResult } from 'express-validator';

import db from '../../config/db_config.mjs';

class StudentController {
  create = async (req, res) => {
    const validation_result = validationResult(req).formatWith(err => err.msg);
    if (!validation_result.isEmpty()) {
      return res.status(400).json({
        error: validation_result.mapped()
      })
    }
    try {
      const { full_name, email, contact_no, education, institute_name, address } = req.body;
      const exist_student = await new Promise((resolve, reject) => {
        const student_checking_query = `SELECT * FROM students WHERE email = ? OR contact_no = ?`;
        db.query(student_checking_query, [email, contact_no], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      });
      if (exist_student.length == 0) {
        const student_create_result = await new Promise((resolve, reject) => {
          const student_create_query = `INSERT INTO students (full_name, email, contact_no, education, institute_name, address) VALUES (?, ?, ?, ?, ?, ?)`;
          db.query(student_create_query, [full_name, email, contact_no, education, institute_name, address], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results)
          })
        });
        const created_student = await new Promise((resolve, reject) => {
          const student_retrieve_query = `SELECT * FROM students WHERE id = ?`;
          db.query(student_retrieve_query, [student_create_result.insertId], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results[0])
          })
        });
        return res.status(200).json({
          message: `Student added successfully`,
          student: created_student
        })
      } else {
        return res.status(422).json({
          message: `Student already exist`,
          student: exist_student[0]
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  };
  getAllStudent = async (req, res) => {
    try {
      const retrieve_students = await new Promise((resolve, reject) => {
        const retrieve_query = `SELECT * FROM students`;
        db.query(retrieve_query, (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      })
      if (retrieve_students.length !== 0) {
        return res.status(200).json({
          message: `Students successfully fetched`,
          students: retrieve_students
        })
      } else {
        return res.status(404).json({
          message: `Students not found`,
          students: []
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  };
  getSingleStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
      const id = parseInt(studentId)
      const retrieve_student = await new Promise((resolve, reject) => {
        const retrieve_query = `SELECT * FROM students WHERE id = ?`;
        db.query(retrieve_query, [id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      })
      if (retrieve_student.length == 1) {
        return res.status(200).json({
          message: `Student successfully fetched`,
          student: retrieve_student[0]
        })
      } else {
        return res.status(404).json({
          message: `Student not found`,
          student: {}
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  };
  editStudent = async (req, res) => {
    const validation_result = validationResult(req).formatWith(err => err.msg);
    if (!validation_result.isEmpty()) {
      return res.status(400).json({
        error: validation_result.mapped()
      })
    }
    try {
      const { full_name, email, contact_no, education, institute_name, address } = req.body;
      const { studentId } = req.params;
      const id = parseInt(studentId);
      const valid_student = await new Promise((resolve, reject) => {
        const student_checking_query = `SELECT * FROM students WHERE id = ?`;
        db.query(student_checking_query, [id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      });
      if (valid_student.length === 1) {
        await new Promise((resolve, reject) => {
          const update_query = `UPDATE students SET full_name = ?, email = ?, contact_no = ?, education = ?, institute_name = ?, address = ? WHERE id = ?`;
          db.query(update_query, 
            [full_name || valid_student[0].full_name, email || valid_student[0].email, contact_no || valid_student[0].contact_no, education || valid_student[0].education, institute_name || valid_student[0].institute_name, address || valid_student[0].address, valid_student[0].id], 
            (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results)
          })
        });
        const updated_student = await new Promise((resolve, reject) => {
          const updated_user_retrieve_query = `SELECT * FROM students WHERE id = ?`;
          db.query(updated_user_retrieve_query, [valid_student[0].id], (err, results) => {
            if (err) {
              console.log(err);
              reject(err)
            }
            resolve(results[0])
          })
        });
        return res.status(200).json({
          message: `Student successfully updated`,
          student: updated_student
        })
      } else {
        return res.status(422).json({
          message: `Error occured, Request not processed`
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Internal server error`
      })
    }
  };
  delete = async (req, res) => {
    try {
      const { studentId } = req.params;
      const id = parseInt(studentId);
      const valid_student = await new Promise((resolve, reject) => {
        const student_checking_query = `SELECT id, full_name, email FROM students WHERE id = ?`;
        db.query(student_checking_query, [id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results[0])
        })
      });
      const delete_student = await new Promise((resolve, reject) => {
        const delete_student_query = `DELETE FROM students WHERE id = ?`;
        db.query(delete_student_query, [valid_student.id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          resolve(results)
        })
      });
      if (delete_student.affectedRows == 1) {
        return res.status(200).json({
          message: `Student successfully deleted`
        })
      } else {
        return res.status(422).json({
          message: `Error occured, Request not processed`
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

export default StudentController;