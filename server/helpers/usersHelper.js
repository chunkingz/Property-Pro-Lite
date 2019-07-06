/* eslint-disable camelcase */
import db from '../models/db';

const { users } = db;

/**
   * Create a new User account.
   * @param {object} email the email of the new user.
   * @param {object} first_name the first name of the new user.
   * @param {object} last_name the last name of the new user.
   * @param {object} password the password of the new user.
   * @param {object} phoneNumber the phone number of the new user.
   * @param {object} address the address of the new user.
   * @param {object} is_admin the admin status of the new user.
   * @return  {Function} next calls the next middleware
   *
   */


const saveNewUser = (email, first_name, last_name, password, phoneNumber, address, is_admin) => {
  const newUser = {
    id: users.length + 1,
    email,
    first_name,
    last_name,
    password,
    phoneNumber,
    address,
    is_admin
  };
  users.push(newUser);
  return users;
};


export default saveNewUser;
