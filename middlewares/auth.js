const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const UnauthorizedError = require('../errors/unauthorized_err');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  let tokenValue;

  if (token) {
    tokenValue = token.replace('Bearer ', '');
  }

  // const { jwt } = req.cookies;

  if (tokenValue) {
    let payload;

    try {
      payload = jsonwebtoken.verify(tokenValue, JWT_SECRET);
    } catch (err) {
      return next(new UnauthorizedError('Некорректный JWT-токен'));
    }

    req.user = payload;

    return next();
  }
  return next(new UnauthorizedError('Доступ запрещен. Необходима авторизация'));

  // const { jwt } = req.cookies;

  // if (jwt) {
  //   let payload;

  //   try {
  //     payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  //   } catch (err) {
  //     return next(new UnauthorizedError('Некорректный JWT-токен'));
  //   }

  //   req.user = payload;

  //   return next();
  // }
  // return next(new UnauthorizedError('Доступ запрещен. Необходима авторизация'));
};
