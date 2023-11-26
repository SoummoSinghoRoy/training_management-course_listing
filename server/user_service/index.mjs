import express from 'express';

import db_connection from '../shared/db/db_config.mjs';
const PORT = 4001;
const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on port-${PORT}`);
  db_connection.getConnection((err, connection) => {
    if (err) throw err;
    console.log("DB connection established......");
    connection.release()
  })
})

import executedMiddleware from './src/middleware/middleware.mjs';
executedMiddleware(app);

import authRouteHandler from './src/routes/authUserRoutes.mjs';
app.use('/api/user', authRouteHandler);