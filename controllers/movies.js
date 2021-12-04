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
  Movie.findOneAndDelete(req.params.movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найден'))
    .then((deletedMovie) => res.send({ data: deletedMovie }))
    .catch((err) => {
      if (err.message === 'CastError') {
        return next(new UncorrectDataError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
