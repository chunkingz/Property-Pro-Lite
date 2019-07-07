import { check } from 'express-validator';

const refactor1 = (a, b) => check(a)
  .not().isEmpty().withMessage(`${a} is required`)
  .isInt()
  .withMessage(`${a} must be a valid number`)
  .isLength({ min: 3 })
  .withMessage(b);

const refactor2 = (a, b) => check(a)
  .not().isEmpty().withMessage(`${a} is required`)
  .isLength({ min: 3 })
  .withMessage(`${a} should be ${b} characters or more`);

const postValidate = [
  check('owner', 'Owner should be set to a valid email').isEmail(),
  refactor1('price', 'invalid price amount'),
  check('state', 'State is required and should be more than 3 chars').isLength({ min: 3 }),
  check('city', 'City is required and should be more than 3 chars').isLength({ min: 3 }),
  check('address', 'Address is required and should be more than 5 chars').isLength({ min: 5 }),
  check('type', 'Type is required and should be a valid type').isLength({ min: 5 }),
];

const userSignUpValidate = [
  check('email', 'Email must be valid').isEmail(),
  refactor2('first_name', 3),
  refactor2('last_name', 3),
  refactor2('password', 5),
  refactor1('phoneNumber', 'Phone Number should be 11 characters'),
  refactor2('address', 5),
];

const userSignInValidate = [
  check('email', 'Email must be valid').isEmail(),
  refactor2('password', 5),
];


export default { postValidate, userSignUpValidate, userSignInValidate };
