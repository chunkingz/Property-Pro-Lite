/* eslint-disable camelcase */
/* eslint-disable no-console */
import pool from '../dbConnect';
import cloudinary from './cloudinary';

const imageUpload = cloudinary;

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
 * Property Not Found Helper For PostgreSQL DB Methods
 * @param  {Object} res the response object
 * @param  {Array} rows the rows array
 * @return  {Function} calls the next middleware if test passes
 */
const NotFound = (res, rows) => {
  if (!rows[0]) {
    return res.status(400).send({
      status: 'error',
      error: 'Property not found',
    });
  }
};

/**
 * Helper function for returning success message in PostgreSQL DB Methods
 * @param  {Object} res the response object
 * @param  {Number} code the http code
 * @param  {Object} message the message object
 * @return  {Function} calls the next middleware if test passes
 */
const success = (res, code, message) => res.status(code).send({
  status: 'success',
  data: message,
});


/**
 * get Properties From PostgreSQL
 * @param  {Object} req the request object
 * @param  {Object} res the response object
 * @param  {String} str the string type
 * @return  {Function} calls the next middleware if test passes
 */
const checkProperty = async (req, res, str) => {
  if (str === 'type') str = `LOWER(${str})`;
  const query = `SELECT * FROM properties WHERE ${str} = $1`;
  try {
    const { rows } = await pool.query(query, [req]);
    const notfound = await NotFound(res, rows);
    if (!notfound) success(res, 200, rows);
  } catch (err) {
    errorHelp(res, err);
  }
};

/**
 * POST/Create a new Property From PostgreSQL
 * @param  {Object} req the request object
 * @param  {Object} res the response object
 * @param  {String} img the image string
 * @return  {Function} calls the next middleware if test passes
 */
const postProp = async (req, res, img) => {
  const {
    owner, price, state, city, address, type
  } = req.body;
  const values = [
    owner,
    'available',
    price,
    state,
    city,
    address,
    type,
    new Date().toDateString(),
    img
  ];
  const queryString = `INSERT INTO 
        properties(owner, status, price, state, city, address, type, created_on, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning *`;
  try {
    const { rows } = await pool.query(queryString, values);
    success(res, 201, rows[0]);
  } catch (err) {
    errorHelp(res, err);
  }
};


/**
 * UPDATE an existing Property From PostgreSQL
 * @param  {Object} req the request object
 * @param  {Object} res the response object
 * @param  {String} img the image string
 * @return  {Function} calls the next middleware if test passes
 */
const updateProp = async (req, res) => {
  const urlString = req.originalUrl.split('/');

  const findOneQuery = 'SELECT * FROM properties WHERE id = $1';
  const {
    owner, price, state, city, address, type
  } = req.body;
  let { status } = req.body;

  if (urlString.length === 4 && urlString[3] === 'sold') status = 'sold';

  const updateOneQuery = `UPDATE properties 
        SET owner=$1, status=$2, price=$3, state=$4, city=$5, address=$6, type=$7, image_url=$8 WHERE id=$9
        returning *`;
  try {
    const { rows } = await pool.query(findOneQuery, [req.params.id]);
    const notfound = await NotFound(res, rows);

    if (!notfound) {
      const { image_url } = req.body;
      let image_uri;
      if (image_url !== '') {
        image_uri = await imageUpload(image_url);
      }
      const values = [
        owner || rows[0].owner,
        status || rows[0].status,
        price || rows[0].price,
        state || rows[0].state,
        city || rows[0].city,
        address || rows[0].address,
        type || rows[0].type,
        image_uri || rows[0].image_url,
        req.params.id
      ];
      const response = await pool.query(updateOneQuery, values);
      success(res, 200, response.rows[0]);
    }
  } catch (err) {
    errorHelp(res, err);
  }
};

/**
   * DELETE an existing Property From the PostgreSQL DB
   * @param  {Object} req the request object
   * @param  {Object} res the response object
   * @return  {Function} calls the next middleware if test passes
   */
const delProperty = async (req, res) => {
  const deleteQuery = 'DELETE FROM properties WHERE id=$1 returning *';
  try {
    const { rows } = await pool.query(deleteQuery, [req.params.id]);
    const notfound = NotFound(res, rows);
    if (!notfound) success(res, 200, 'Property Ad Deleted');
  } catch (err) {
    errorHelp(res, err);
  }
};

export default {
  checkProperty, postProp, updateProp, delProperty
};
