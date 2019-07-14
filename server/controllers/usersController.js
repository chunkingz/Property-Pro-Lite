/* eslint-disable no-console */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import payload from '../helpers/auth';
import errorHelpers from '../helpers/errorHelper';
import getter from '../helpers/getter';
import PGuserHelper from '../helpers/PGuserHelper';

const { checkIfUserExists, postUser } = PGuserHelper;
const { payloader } = payload;
const { authError, inputError } = errorHelpers;
const { getUsersandFlags } = getter;


/**
 * Sign up a new User account.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const userSignUp = async (req, res) => {
  postUser(req, res);
};


/**
 * Login an existing User account.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const userSignIn = async (req, res) => {
  const { password } = req.body;
  const inputErr = await inputError(req, res);
  if (!inputErr) {
    const data = await checkIfUserExists(req);
    const isMatch = await bcrypt.compare(password, data[0].password);
    if (!isMatch) {
      return authError(res);
    }
    try {
      return payloader(res, data, 200);
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * Fetch all existing Users accounts (Admin route).
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const usersDB = async (req, res) => {
  getUsersandFlags(res, 'users');
};

export default { userSignUp, userSignIn, usersDB };
