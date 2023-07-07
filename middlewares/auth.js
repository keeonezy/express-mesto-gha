const jwt = require('jsonwebtoken');
const UnauthorizedError = require("../utils/UnauthorizedError")


const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Нужна авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env['SECRET__HEHE']);
  } catch (err) {
    return next(new UnauthorizedError('Нужна авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
