/* eslint-disable no-console */
/* eslint-disable camelcase */
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import db from '../models/db';
import saveNewUser from '../helpers/usersHelper';
import payload from '../helpers/auth';

const { users } = db;
const { payloader } = payload;
const checkIfUserExists = req => users.find(user => user.email === req);

/**
 * Sign up a new User account.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const userSignUp = async (req, res) => {
  const {
    email, first_name, last_name, phoneNumber, address, is_admin
  } = req.body;
  let { password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      status: 'error',
      errorMsg: errors.array(),
    });
  }

  const data = checkIfUserExists(email);
  if (data !== undefined) {
    return res.status(400).send({
      status: 'error',
      data: {
        message: 'User already exists, kindly login'
      }
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const newUser = await saveNewUser(
      email, first_name, last_name, password, phoneNumber, address, is_admin
    );
    return payloader(res, newUser[newUser.length - 1], 201);
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      error: err
    });
  }
};

/**
 * Auth Error helper.
 * @param {object} res the response object.
 *
*/

const error = res => res.status(400).send({
  status: 'error',
  message: 'Invalid credentials'
});

/**
 * Login an existing User account.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const userSignIn = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      status: 'error',
      errorMsg: errors.array(),
    });
  }
  const data = checkIfUserExists(email);
  if (data === undefined) {
    return error(res);
  }
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    return error(res);
  }
  try {
    return payloader(res, data, 200);
  } catch (err) {
    console.log(err);
  }
};

export default { userSignUp, userSignIn };
