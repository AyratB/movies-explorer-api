const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../config/config');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const UnauthorizedError = require('../errors/unauthorized_err');
const NotFoundError = require('../errors/not_found_err');
const DefaultError = require('../errors/default-err');
const ConflictRequestError = require('../errors/conflict_request_err');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NoValidid'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      if (err.message === 'CastError') {
        return next(new UncorrectDataError('Переданы некорректные данные'));
      }
      return next(new DefaultError('Произошла ошибка получения данных пользователя'));
    });
};

module.exports.updateUserData = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .where('_id').equals(req.user._id)
    .orFail(new Error('NoValidid'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      if (err.message === 'CastError') {
        return next(new UncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      }
      if ((err.name === 'MongoError' && err.code === 11000)) {
        return next(new ConflictRequestError('Переданный email уже используется другим пользователем'));
      }
      return next(new DefaultError('Ошибка по умолчанию'));
    });
};

// регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new UncorrectDataError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ConflictRequestError('Попытка зарегистрироваться по существующему email'));
      }
      return next(new DefaultError('Ошибка по умолчанию'));
    });
};

// вход
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({
          message: 'Логин прошел успешно',
          token,
        });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

// выход
module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.redirect('/');

  next();

  // II res.clearCookie('jwt', { path: '/' });

  // III res.status(202).clearCookie('jwt').send('cookie cleared');

  // IV return res
  // .clearCookie("jwt")
  // .status(200)
  // .json({ message: "Successfully logged out" });

  // V res.clearCookie('jwt');
  // next();
};
