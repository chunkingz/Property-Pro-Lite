/* eslint-disable no-console */
import pool from '../dbConnect';

/**
 * Main GET Helper Method.
 * @param {object} res the response object.
 * @param {string} tableName the table name in the database.
 * @return  {Function} next calls the next middleware
 *
*/
const getUsersandFlags = async (res, tableName) => {
  try {
    await pool.query(`SELECT * FROM ${tableName}`, (error, response) => {
      if (error) console.log(error);
      res.status(200).send({
        status: 'success',
        data: {
          message: `All ${tableName} successfully retrieved`,
          data: response.rows,
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};


/**
 * GET Properties Helper Method.
 * @param {object} data the data object.
 * @param {object} res the response object.
 * @param {string} errMsg the error message.
 * @return  {Function} next calls the next middleware
 *
*/
const getProps = (data, res, errMsg) => {
  if (data !== undefined) {
    return getUsersandFlags(res, 'properties');
  }
  return res.status(400).send({
    status: 'error',
    error: errMsg,
  });
};


export default { getProps, getUsersandFlags };
