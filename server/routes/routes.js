import express from 'express';
import validate from '../helpers/validator';
import properties from '../controllers/propertiesController';
import users from '../controllers/usersController';

const { postValidate, userSignUpValidate, userSignInValidate } = validate;
const { userSignUp, userSignIn } = users;
const {
  getAllProperties, getPropertiesByType, getProperty, postProperty, putProperty, deleteProperty
} = properties;

const router = express.Router();


// Create user account
router.post('/api/v1/auth/signup', userSignUpValidate, userSignUp);

// Login a user account
router.post('/api/v1/auth/signin', userSignInValidate, userSignIn);

// fetch all properties
router.get('/api/v1/properties', getAllProperties);

// fetch single property
router.get('/api/v1/property/:id', getProperty);

// create a new property
router.post('/api/v1/property', postValidate, postProperty);

// update property
router.patch('/api/v1/property/:id', putProperty);

// delete property
router.delete('/api/v1/property/:id', deleteProperty);

// fetch all properties of a certain type
router.get('/api/v1/property', getPropertiesByType);


export default router;
