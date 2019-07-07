/* eslint-disable no-console */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import db from '../models/db';
import saveNewUser from '../helpers/usersHelper';
import payload from '../helpers/auth';
import errorHelpers from '../helpers/errorHelper';

const { users } = db;
const { payloader } = payload;
const { authError, inputError, userExists } = errorHelpers;

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
  inputError(req, res);
  const data = checkIfUserExists(email);
  userExists(res, data);
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
 * Login an existing User account.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const userSignIn = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  inputError(req, res);
  const data = checkIfUserExists(email);
  if (data === undefined) {
    return authError(res);
  }
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    return authError(res);
  }
  try {
    return payloader(res, data, 200);
  } catch (err) {
    console.log(err);
  }
};

export default { userSignUp, userSignIn };
