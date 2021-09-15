const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser, updateUserData,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserData);

module.exports = router;
