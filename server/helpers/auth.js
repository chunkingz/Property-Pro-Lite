import jwt from 'jsonwebtoken';

/**
 * Authenticates a User.
 * @param {object} req the request object.
 * @param {object} res the response object.
 * @param {object} next calls the next middleware.
 * @return  {Function} next calls the next middleware
 *
*/

const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({
      status: 'error',
      error: 'No token, auth denied'
    });
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
 *
*/

const payloader = async (res, data, code) => {
  const payload = {
    user: {
      id: data.id
    }
  };
  await jwt.sign(
    payload,
    'jwtSecret',
    { expiresIn: '7d' },
    (err, token) => {
      if (err) throw err;
      return res.status(code).send({
        status: 'success',
        data: {
          token,
          data,
        }
      });
    }
  );
};

export default { authMiddleware, payloader };
