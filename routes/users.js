const router = require('express').Router();
const { validateUserBody } = require('../middlewares/validations');

const {
  getCurrentUser,
  updateUserData,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validateUserBody, updateUserData);

module.exports = router;
