const mongoose = require('mongoose');
const Movie = require('../models/movie');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const NotFoundError = require('../errors/not_found_err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: { _id: req.user._id } })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .where('owner').equals(new mongoose.Types.ObjectId(req.user._id))
    .orFail(new NotFoundError('Указанный фильм не найден'))
    .then((movie) => {
      if (!movie) return next(new NotFoundError('Указанный фильм не найден'));

      return Movie.deleteOne({ movieId: req.params.movieId })
        .orFail(new NotFoundError('Указанный фильм не найден'))
        .then((deletedMovie) => res.status(200).send({ data: deletedMovie }));
    })
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return next(new NotFoundError('Фильм с указанным _id не найдена'));
      }
      if (err.message === 'CastError') {
        return next(new UncorrectDataError('Переданы некорректные данные'));
      }
      return next(new Error('Произошла ошибка удаления'));
    });
};
