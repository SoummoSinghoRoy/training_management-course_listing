import express from 'express';

import db_connection from './config/db_config.mjs';
const PORT = 4000;
const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on port-${PORT}`);
  db_connection.getConnection((err, connection) => {
    if (err) throw err;
    console.log("DB connection established......");
    connection.release()
  })
})

import executedMiddleware from './middlewares/middleware.mjs';
executedMiddleware(app);

import executedRoute from './api/routes/routes.mjs';
executedRoute(app)