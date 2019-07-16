/* eslint-disable no-console */
/* eslint-disable camelcase */
import helpers from '../helpers/PGpropertyHelper';
import getter from '../helpers/getter';
import cloudinary from '../helpers/cloudinary';
import errorHelpers from '../helpers/errorHelper';


const {
  checkProperty, postProp, updateProp, delProperty
} = helpers;
const imageUpload = cloudinary;
const { inputError, idError } = errorHelpers;
const { getUsersandFlags } = getter;

/**
 * Get all properties.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const getAllProperties = async (req, res) => {
  await getUsersandFlags(res, 'properties');
};

/**
 * Get all properties of a certain type, e.g 2 bedroom.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const getPropertiesByType = async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    return res.status(400).send({
      status: 'error',
      error: 'Invalid url parameters'
    });
  }

  await checkProperty(req.query.type.toLowerCase(), res, 'type');
};


/**
 * Get a specific property.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const getProperty = async (req, res) => {
  const iderr = await idError(req, res);
  if (!iderr) await checkProperty(req.params.id, res, 'id');
};

/**
 * Create/POST a property ad.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const postProperty = async (req, res) => {
  const { image_url } = req.body;
  const inputErr = await inputError(req, res);

  if (!inputErr) {
    const image_uri = await imageUpload(image_url);
    await postProp(req, res, image_uri);
  }
};

/**
 * Update property data.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const putProperty = async (req, res) => {
  const iderr = await idError(req, res);
  if (!iderr) await updateProp(req, res);
};

/**
 * Delete a property ad.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/
const deleteProperty = async (req, res) => {
  const iderr = await idError(req, res);
  if (!iderr) await delProperty(req, res);
};


export default {
  getAllProperties, getPropertiesByType, getProperty, postProperty, putProperty, deleteProperty
};
