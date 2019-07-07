import { check } from 'express-validator';

const refactor = (a, b) => check(a)
  .not().isEmpty().withMessage(`${a} is required`)
  .isInt()
  .withMessage(`${a} must be a valid number`)
  .isLength({ min: 3 })
  .withMessage(b);

const postValidate = [
  check('owner', 'Owner should be set to a valid email').isEmail(),
  refactor('price', 'invalid price amount'),
  check('state', 'State is required and should be more than 3 chars').isLength({ min: 3 }),
  check('city', 'City is required and should be more than 3 chars').isLength({ min: 3 }),
  check('address', 'Address is required and should be more than 5 chars').isLength({ min: 5 }),
  check('type', 'Type is required and should be a valid type').isLength({ min: 5 }),
];

const userSignUpValidate = [
  check('email', 'Email must be valid').isEmail(),
  check('first_name')
    .not().isEmpty().withMessage('First name is required')
    .isLength({ min: 3 })
    .withMessage('First name should be 3 characters or more'),
  check('last_name')
    .not().isEmpty().withMessage('Last name is required')
    .isLength({ min: 3 })
    .withMessage('Last name should be 3 characters or more'),
  check('password')
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 3 })
    .withMessage('Password should be 5 characters or more'),
  refactor('phoneNumber', 'Phone Number should be 11 characters'),
  check('address')
    .not().isEmpty().withMessage('Address is required')
    .isLength({ min: 3 })
    .withMessage('Address should be 5 characters or more'),
];

const userSignInValidate = [
  check('email', 'Email must be valid').isEmail(),
  check('password')
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 3 })
    .withMessage('Password should be 5 characters or more'),
];


export default { postValidate, userSignUpValidate, userSignInValidate };
