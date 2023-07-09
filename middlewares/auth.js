const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/status-401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return next(new UnauthorizedError('Need authentication'));
  }

  let payload; // Полезная нагрузка (чем мы нагрузили наш запрос)

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Need authentication'));
  }

  req.user = payload;
  return next();
};
