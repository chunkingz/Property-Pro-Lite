import express from 'express';
import validate from '../helpers/validator';
import properties from '../controllers/propertiesController';
import users from '../controllers/usersController';
import flags from '../controllers/flagsController';
import auth from '../helpers/auth';
import checkIfAdmin from '../helpers/checkIfAdmin';

const { authMiddleware } = auth;
const { postValidate, userSignUpValidate, userSignInValidate } = validate;
const { userSignUp, userSignIn, usersDB } = users;
const {
  getAllProperties, getPropertiesByType, getProperty, postProperty, putProperty, deleteProperty
} = properties;
const flagsDB = flags;

const router = express.Router();

// Create user account
router.post('/api/v1/auth/signup', userSignUpValidate, userSignUp);

// Login a user account
router.post('/api/v1/auth/signin', userSignInValidate, userSignIn);

// fetch all properties
router.get('/api/v1/properties', authMiddleware, getAllProperties);

// fetch single property
router.get('/api/v1/property/:id', authMiddleware, getProperty);

// fetch all properties of a certain type
router.get('/api/v1/property', authMiddleware, getPropertiesByType);

// create a new property
router.post('/api/v1/property', authMiddleware, postValidate, postProperty);

// update property
router.patch('/api/v1/property/:id', authMiddleware, putProperty);

// delete property
router.delete('/api/v1/property/:id', authMiddleware, deleteProperty);


/**
 * EXTRA ROUTES
 */

// fetch all users
router.get('/api/v1/users', authMiddleware, checkIfAdmin, usersDB);

// fetch all flags
router.get('/api/v1/flags', authMiddleware, checkIfAdmin, flagsDB);


export default router;
