/* eslint-disable no-console */
import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for checking if its a valid User.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @param {object} next calls the next middleware.
 * @return  {Function} next calls the next middleware
 *
*/
const authMiddleware = async (req, res, next) => {
  const token1 = req.headers.authorization;
  const token2 = req.body.authorization;

  if (!token1 && !token2) {
    return res.status(401).send({
      status: 'error',
      error: 'No token, auth denied'
    });
  }
  let token;
  if (typeof token1 !== 'undefined') {
    token = token1;
  } else {
    token = token2;
  }
  try {
    const decoded = jwt.verify(token, 'jwtSecret');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).send({
      status: 'error',
      error: 'Invalid Token'
    });
  }
};

/**
 * Payload middleware/helper function.
 * @param {object} res the response object.
 * @param {object} data the payload parameter.
 * @param {object} code the http status code.
 *
*/
const payloader = async (res, data, code) => {
  const payload = {
    user: {
      id: data[0].id
    }
  };
  await jwt.sign(
    payload,
    'jwtSecret',
    { expiresIn: '7d' },
    (err, token) => {
      if (err) {
        console.log(err);
        return res.status(400).send({
          status: 'error',
          error: err
        });
      }
      return res.status(code).send({
        status: 'success',
        data: {
          token,
          data: data[0],
        }
      });
    }
  );
};

export default { authMiddleware, payloader };
