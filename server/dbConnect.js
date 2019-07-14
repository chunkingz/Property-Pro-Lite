/* eslint-disable no-console */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const {
  PGHOST, PGUSER1, PGPASSWORD, PGPORT1
} = process.env;

const connectionString = `postgres://${PGUSER1}:${PGPASSWORD}@${PGHOST}:${PGPORT1}/${PGUSER1}`;

const pool = new Pool({ connectionString });

export default pool;
