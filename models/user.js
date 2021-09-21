const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const UnauthorizedError = require('../errors/unauthorized_err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный формат переданного email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  if (email && password) {
    return this.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
            }

            return user;
          });
      });
  }

  return Promise.reject(new UncorrectDataError('Пароль или email не могут быть пустыми'));
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
