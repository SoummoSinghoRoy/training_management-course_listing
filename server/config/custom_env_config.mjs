/*import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({path: envPath});*/

import * as dotenv from 'dotenv';
dotenv.config()

const env_variable = {
  db: process.env.DB,
  db_host: process.env.DB_Host,
  db_port: process.env.DB_Port,
  db_user: process.env.DB_User,
  db_password: process.env.DB_Password,
  secret_key: process.env.SECRET
}

export default env_variable;