const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const UnauthorizedError = require('../errors/unauthorized_err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (jwt) {
    let payload;

    try {
      payload = jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new UnauthorizedError('Некорректный JWT-токен'));
    }

    req.user = payload;

    next();
  } else {
    next(new UnauthorizedError('Доступ запрещен. Необходима авторизация'));
  }
};
