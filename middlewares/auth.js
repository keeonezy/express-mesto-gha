const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/status-401');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Нужна авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET__HEHE);
  } catch (err) {
    next(new UnauthorizedError('Нужна авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
