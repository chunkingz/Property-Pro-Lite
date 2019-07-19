/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import payload from '../helpers/auth';
import errorHelpers from '../helpers/errorHelper';
import getter from '../helpers/getter';
import PGuserHelper from '../helpers/PGuserHelper';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { checkIfUserExists, postUser, errorHelp } = PGuserHelper;
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
 * User forgot or wishes to change his/her password.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const userFortgotPassword = async (req, res) => {
  const { email } = req.params;

  if (Object.keys(req.body).length === 0) {
    console.log(' ** sending user a mail containing new password... **');

    const msg = {
      to: email,
      from: 'admin@property-pro-lite-ng.com',
      subject: 'Password Reset From Property Pro Lite',
      text: 'Your new password is ********** . kindly login with it and change it afterwards',
      html: '<strong> <br>Your new password is ********** . kindly login with it and change it afterwards</strong> <br><br>Regards, <br>Admin Property Pro Lite.',
    };

    await sgMail.send(msg).then(() => {
      console.log('** sent **');
      return res.status(204).send({
        status: 'success',
        data: 'mail sent to user successfully',
      });
    }).catch((error) => {
      errorHelp(res, error.toString());
    });
  }

  if (Object.keys(req.body).length > 0) {
    const { password, new_password } = req.body;
    if (password === new_password) console.log('passwords match');
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

export default {
  userSignUp, userSignIn, usersDB, userFortgotPassword
};
