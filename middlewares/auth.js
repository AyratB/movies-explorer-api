const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const UnauthorizedError = require('../errors/unauthorized_err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (jwt) {
    let payload;

    try {
      payload = jsonwebtoken.verify(jwt, JWT_SECRET);
    } catch (err) {
      return next(new UnauthorizedError('Некорректный JWT-токен'));
    }

    req.user = payload;

    return next();
  }
  return next(new UnauthorizedError('Доступ запрещен. Необходима авторизация'));
};
