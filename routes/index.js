const router = require('express').Router();
const userRoutes = require('./users');
const moviesRoutes = require('./movies');

const auth = require('../middlewares/auth');
const { validateAutentication, validateCreateUser } = require('../middlewares/validations');

const NotFoundError = require('../errors/not_found_err');

const {
  login, logout, createUser,
} = require('../controllers/users');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateAutentication, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);
router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
