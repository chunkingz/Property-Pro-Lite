import { validationResult } from 'express-validator';

/**
 * Auth Error helper.
 * @param {object} res the response object.
 * @return  {Function} calls the next middleware if test passes
*/
const authError = res => res.status(400).send({
  status: 'error',
  message: 'Invalid credentials'
});

/**
 * Input Error helper.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} calls the next middleware if test passes
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

/**
 * id Error helper.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @return  {Function} calls the next middleware if test passes
*/
const idError = (req, res) => {
  const { id } = req.params;
  const isNotNumber = /\D/;
  if (isNotNumber.test(id)) {
    return res.status(400).send({
      status: 'error',
      errorMsg: 'Invalid id number'
    });
  }
};

export default { authError, inputError, idError };
