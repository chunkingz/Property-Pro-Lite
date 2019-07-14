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
router.post('/auth/signup', userSignUpValidate, userSignUp);

// Login a user account
router.post('/auth/signin', userSignInValidate, userSignIn);

// fetch all properties
router.get('/properties', authMiddleware, getAllProperties);

// fetch single property
router.get('/property/:id', authMiddleware, getProperty);

// fetch all properties of a certain type
router.get('/property', authMiddleware, getPropertiesByType);

// create a new property
router.post('/property', authMiddleware, postValidate, postProperty);

// update property
router.patch('/property/:id', authMiddleware, putProperty);

// delete property
router.delete('/property/:id', authMiddleware, deleteProperty);


/**
 * EXTRA ROUTES
 */

// fetch all users
router.get('/users', authMiddleware, checkIfAdmin, usersDB);

// fetch all flags
router.get('/flags', authMiddleware, checkIfAdmin, flagsDB);


export default router;
