/* eslint-disable no-console */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import payload from './auth';
import errorHelpers from './errorHelper';
import pool from '../dbConnect';

const { payloader } = payload;
const { inputError } = errorHelpers;


/**
 * Helper function for throwing caught errors in PostgreSQL DB Methods
 * @param  {Object} res the response object
 * @param  {String} err the error object
 * @return  {Function} calls the next middleware if test passes
 */
const errorHelp = (res, err) => {
  console.log(err);
  return res.status(400).send({
    status: 'error',
    error: err
  });
};


/**
 * Helper function to throw err if User already exists in PostgreSQL DB
 * @param  {Object} res the response object
 * @param  {Array} rows the rows array
 * @return  {Function} calls the next middleware if test passes
 */
const alreadyExists = (res, rows) => {
  if (rows[0]) {
    return res.status(400).send({
      status: 'error',
      error: 'User already exists',
    });
  }
};


/**
 * Helper function to check if User already exists in PostgreSQL DB
 * @param  {Object} req the request object
 * @param  {Object} res the response object
 * @return  {Function} calls the next middleware if test passes
 */
const checkIfUserExists = async (req, res) => {
  const { email } = req.body;
  const findOneQuery = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await pool.query(findOneQuery, [email]);
    return rows;
  } catch (err) {
    errorHelp(res, err);
  }
};


/**
 * POST/Create a new User in PostgreSQL DB
 * @param  {Object} req the request object
 * @param  {Object} res the response object
 * @return  {Function} calls the next middleware if test passes
 */
const postUser = async (req, res) => {
  const {
    email, first_name, last_name, phone_number, address, is_admin
  } = req.body;
  let { password } = req.body;
  const inputerr = await inputError(req, res);

  if (!inputerr) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const values = [
      email,
      first_name,
      last_name,
      password,
      phone_number,
      address,
      is_admin,
    ];
    const queryString = `INSERT INTO 
            users(email, first_name, last_name, password, phone_number, address, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            returning *`;
    try {
      const rows = await checkIfUserExists(req, res);
      const alreadyexists = await alreadyExists(res, rows);

      if (alreadyexists === undefined) {
        const response = await pool.query(queryString, values);
        return payloader(res, response.rows, 201);
      }
    } catch (err) {
      errorHelp(res, err);
    }
  }
};

export default {
  errorHelp, alreadyExists, checkIfUserExists, postUser
};
