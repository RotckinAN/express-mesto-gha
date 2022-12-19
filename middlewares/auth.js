const jwt = require('jsonwebtoken');
const { tokenKey } = require('../helpers/token');
const { Unauthorized } = require('../errors/unauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!req.cookies) {
      throw new Unauthorized('Необходима авторизация');
    }

    try {
      payload = jwt.verify(token, tokenKey);
    } catch (err) {
      throw new Unauthorized('Необходима авторизация');
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  auth,
};
