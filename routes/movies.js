const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies, createMovie, deleteMovie, likeCard, dislikeCard,
} = require('../controllers/movies');

const isUrl = (value) => {
  if (validator.isURL(value)) {
    return value;
  }
  throw new Error('URL validation err');
};

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .integer()
      .required()
      .min(0),
    year: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    image: Joi.string()
      .required()
      .custom(isUrl),
    trailer: Joi.string()
      .required()
      .custom(isUrl),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
    thumbnail: Joi.string()
      .required()
      .custom(isUrl),
    movieId: Joi.number()
      .integer()
      .required(),
  }),
}), createMovie);

router.delete('/:movieId ', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
      .hex()
      .length(24),
  }),
}), deleteMovie);

// router.put('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24),
//   }),
// }), likeCard);

// router.delete('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24),
//   }),
// }), dislikeCard);

module.exports = router;
