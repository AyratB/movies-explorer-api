const Movie = require('../models/movie');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const NotFoundError = require('../errors/not_found_err');
const DefaultError = require('../errors/default-err');
const ForbiddenError = require('../errors/forbidden_err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err.name === 'ValidationError'
      ? new UncorrectDataError('Ошибка получения карточек')
      : new DefaultError('Ошибка по умолчанию')));
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
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err.name === 'ValidationError'
      ? new UncorrectDataError('Переданы некорректные данные при создании фильма')
      : new DefaultError('Ошибка по умолчанию')));
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params.movieId;
  const notFoundMovieMessage = 'Фильм с указанным _id не найден';

  Movie.findById(movieId)
    .orFail(new Error('NoValidid'))
    .then((movie) => {
      if (!movie) next(new NotFoundError(notFoundMovieMessage));
      if (movie.owner !== req.user._id) next(new ForbiddenError('Не совпадает автор фильма и id пользователя'));

      return Movie.deleteOne(movieId)
        .orFail(next(new NotFoundError(notFoundMovieMessage)))
        .then((deletedMovie) => res.status(200).send({ data: deletedMovie }));
    })
    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError(notFoundMovieMessage));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные'));
      } else {
        next(new DefaultError('Произошла ошибка удаления фильма'));
      }
    });
};





module.exports.likeCard = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .then((likedCard) => res.status(200).send({ data: likedCard }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(new DefaultError('Произошла ошибка постановки лайка карточки'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .then((dislikedCard) => res.status(200).send({ data: dislikedCard }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные для удаления лайка'));
      } else {
        next(new DefaultError('Произошла ошибка постановки удаления лайка карточки'));
      }
    });
};
