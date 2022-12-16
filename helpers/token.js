const jwt = require('jsonwebtoken');

const tokenKey = 'secret_cody_by_mesto_app';

const generateToken = (payload) => jwt.sign(payload, tokenKey, { expiresIn: '7d' });

module.exports = {
  tokenKey,
  generateToken,
};
