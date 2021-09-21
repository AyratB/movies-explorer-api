const Movie = require('../models/movie');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const NotFoundError = require('../errors/not_found_err');
const ForbiddenError = require('../errors/forbidden_err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send({ data: cards }))
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
  const { movieId } = req.params;
  const notFoundMovieMessage = 'Фильм с указанным _id не найден';

  Movie.findById(movieId)
    .orFail(new NotFoundError(notFoundMovieMessage))
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(notFoundMovieMessage));
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError('Не совпадает автор фильма и id пользователя'));
      }

      return Movie.findOneAndRemove(movieId)
        .orFail(new NotFoundError(notFoundMovieMessage))
        .then((deletedMovie) => res.send({ data: deletedMovie }));
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        return next(new UncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
