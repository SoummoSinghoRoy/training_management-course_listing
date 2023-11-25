import mysql from 'mysql';

import env_variable from '../env_config/custom_env_config.mjs';

const db_connection = mysql.createPool({
  host: env_variable.db_host,
  port: env_variable.db_port,
  user: env_variable.db_user,
  password: env_variable.db_password,
  database: env_variable.db
})

export default db_connection;