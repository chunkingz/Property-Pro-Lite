/* eslint-disable no-console */
/* eslint-disable camelcase */
import db from '../models/db';

const { property } = db;


/**
   * Create a new property.
   * @param {object} owner the owner of the property ad.
   * @param {object} status current status of the property ad, e.g available/sold.
   * @param {object} price the price of the property ad.
   * @param {object} state the state location of the property ad.
   * @param {object} city the city location of the property ad.
   * @param {object} address the address location of the property ad.
   * @param {object} type the type of the property ad, e.g 2 bedroom.
   * @param {object} created_on the date the property ad was posted.
   * @param {object} image_url the image url of the property ad.
   * @return  {Function} next calls the next middleware
   *
   */

const saveNewProperty = (owner, price, state, city, address, type, image_url) => {
  const newProperty = {
    id: property.length + 1,
    owner,
    status: 'available',
    price,
    state,
    city,
    address,
    type,
    created_on: new Date().toDateString(),
    image_url,
  };
  property.push(newProperty);
  return property;
};

/**
   * Update existing property.
   * @param {object} owner the owner of the property ad.
   * @param {object} status current status of the property ad, e.g available/sold.
   * @param {object} price the price of the property ad.
   * @param {object} state the state location of the property ad.
   * @param {object} city the city location of the property ad.
   * @param {object} address the address location of the property ad.
   * @param {object} type the type of the property ad, e.g 2 bedroom.
   * @param {object} created_on the date the property ad was posted.
   * @param {object} image_url the image url of the property ad.
   * @return  {Function} next calls the next middleware
   *
   */

const updateProperty = (id, owner, status, price, state, city, address, type, image_url) => {
  const propertyId = property.find(prop => prop.id === id);
  propertyId.owner = owner || propertyId.owner;
  propertyId.status = status || propertyId.status;
  propertyId.price = price || propertyId.price;
  propertyId.state = state || propertyId.state;
  propertyId.city = city || propertyId.city;
  propertyId.address = address || propertyId.address;
  propertyId.type = type || propertyId.type;
  propertyId.image_url = image_url || propertyId.image_url;
  return propertyId;
};


/**
   * Delete existing property.
   * @param {object} id the id of the property ad to be deleted.
   * @return  {Function} next calls the next middleware
   *
   */

const deletesProperty = (id) => {
  const index = property.indexOf(id);
  property.splice(index, 1);
};


export default { saveNewProperty, updateProperty, deletesProperty };
