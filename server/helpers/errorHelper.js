import { validationResult } from 'express-validator';

/**
 * Auth Error helper.
 * @param {object} res the response object.
 *
*/

const authError = res => res.status(400).send({
  status: 'error',
  message: 'Invalid credentials'
});

/**
 * Input Error helper.
 * @param {object} req the request object.
 * @param {object} res the response object.
 *
*/

const inputError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      status: 'error',
      errorMsg: errors.array(),
    });
  }
};

export default { authError, inputError };
