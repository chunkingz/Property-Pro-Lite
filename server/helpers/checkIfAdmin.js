/* eslint-disable no-console */
import pool from '../dbConnect';
import errHelp from './PGuserHelper';

const { errorHelp } = errHelp;

/**
 * Authentication middleware for checking if user has admin rights.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @param {object} next calls the next middleware.
 * @return  {Function} next calls the next middleware
 *
*/
const checkIfAdmin = async (req, res, next) => {
  const isAdminQuery = 'SELECT * FROM users WHERE id=$1 AND is_admin=$2';
  try {
    const { rows } = await pool.query(isAdminQuery, [req.user.id, true]);
    if (!rows[0]) {
      return res.status(400).send({
        status: 'error',
        error: 'You do not have admin rights',
      });
    }
  } catch (err) {
    errorHelp(res, err);
  }
  next();
};

export default checkIfAdmin;
