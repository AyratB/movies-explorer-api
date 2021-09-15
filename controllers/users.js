const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

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
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные'));
      } else {
        next(new DefaultError('Произошла ошибка получения данных пользователя'));
      }
    });
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
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
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new DefaultError('Ошибка по умолчанию'));
      }
    });
};

// signup
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictRequestError('Попытка зарегистрироваться оп существующему email'));
      } else {
        next(new DefaultError('Ошибка по умолчанию'));
      }
    });
};

// signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
