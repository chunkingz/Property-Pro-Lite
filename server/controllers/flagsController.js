/* eslint-disable no-console */
import getter from '../helpers/getter';

const { getUsersandFlags } = getter;

/**
 * Fetch all submitted bad reports/flags (Admin route).
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const flagsDB = async (req, res) => {
  getUsersandFlags(res, 'flags');
};

export default flagsDB;
