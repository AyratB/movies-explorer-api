const router = require('express').Router();
const { validateMovieBody, validateMovieId } = require('../middlewares/validations');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieBody, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

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
