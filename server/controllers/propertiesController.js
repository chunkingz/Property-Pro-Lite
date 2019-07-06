/* eslint-disable no-console */
/* eslint-disable camelcase */
import { validationResult } from 'express-validator';
import db from '../models/db';
import helpers from '../helpers/propertyHelper';
import cloudinary from '../helpers/cloudinary';

const { saveNewProperty, updateProperty, deletesProperty } = helpers;
const { property } = db;
const imageUpload = cloudinary;

/**
 * check if the property id is correct
 * @param  {Object} req the request object
 * @return  {Function} calls the next middleware if test passes
 */
const checkProperty = req => property.find(prop => prop.id === parseInt(req, 10));
const checkPropertyType = req => property.find(prop => prop.type === req);


/**
 * Get all properties.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const getAllProperties = (req, res) => res.status(200).send({
  status: 'success',
  data: {
    message: 'All Properties successfully retrieved',
    property,
  }
});

/**
 * Get all properties of a certain type, e.g 2 bedroom.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const getPropertiesByType = (req, res) => {
  const data = checkPropertyType(req.query.type);
  if (data !== undefined) {
    return res.status(200).send({
      status: 'success',
      data: {
        message: 'Property successfully retrieved by type',
        data
      }
    });
  }
  return res.status(400).send({
    status: 'error',
    error: 'Invalid type',
  });
};

/**
 * Get a specific property.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const getProperty = (req, res) => {
  const data = checkProperty(req.params.id);
  if (data !== undefined) {
    return res.status(200).send({
      status: 'success',
      data: {
        message: 'Property successfully retrieved',
        data
      }
    });
  }
  return res.status(400).send({
    status: 'error',
    error: 'Invalid ID',
  });
};

/**
 * Create/POST a property ad.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const postProperty = async (req, res) => {
  const {
    owner, price, state, city, address, type, image_url
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      status: 'error',
      errorMsg: errors.array(),
    });
  }
  const image_uri = imageUpload(image_url);

  const newProperty = await saveNewProperty(
    owner, price, state, city, address, type, image_uri
  );
  return res.status(201).send({
    status: 'success',
    data: {
      newProperty: newProperty[newProperty.length - 1],
    }
  });
};

/**
 * Update property data.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const putProperty = (req, res) => {
  const data = checkProperty(req.params.id);
  if (data !== undefined) {
    const {
      owner, status, price, state, city, address, type, image_url
    } = req.body;

    const updatedProperty = updateProperty(
      data.id, owner, status, price, state,
      city, address, type, image_url
    );
    return res.status(201).send({
      status: 'success',
      data: {
        message: 'Property updated successfully',
        updatedProperty
      }
    });
  }
  return res.status(400).send({
    status: 'error',
    error: 'Property ad not found',
  });
};

/**
 * Delete a property ad.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} next calls the next middleware
 *
*/

const deleteProperty = async (req, res) => {
  const data = await checkProperty(req.params.id);
  if (data !== undefined) {
    // console.log(data.id);
    const remain = await deletesProperty(data.id);
    return res.status(200).send({
      status: 'success',
      message: 'Property ad deleted successfully',
      remain
    });
  }
  return res.status(400).send({
    status: 'error',
    error: 'Property ad not found',
  });
};


export default {
  getAllProperties, getPropertiesByType, getProperty, postProperty, putProperty, deleteProperty
};
