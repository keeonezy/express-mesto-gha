const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/status-401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Нужна авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new UnauthorizedError('Нужна авторизация'));
    return;
  }

  req.user = payload;
  next();
};