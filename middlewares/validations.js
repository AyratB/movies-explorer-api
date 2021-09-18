const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isUrl = (value) => {
  if (validator.isURL(value)) {
    return value;
  }
  throw new Error('URL validation err');
};

const validateAutentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string()
      .required()
      .min(2)
      .message('Поле "password" должно быть валидным паролем')
      .messages({
        'any.required': 'Поле "password" должно быть заполнено',
      }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string()
      .required()
      .min(2)
      .message('Поле "password" должно быть валидным паролем')
      .messages({
        'any.required': 'Поле "password" должно быть заполнено',
      }),
    name: Joi.string()
      .min(2)
      .max(30)
      .message('Поле "name" должно быть валидным')
      .messages({
        'string.required': 'Поле "name" должно быть от 2 до 30 символов',
      }),
  }),
});

const validateMovieBody = celebrate({
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
});

const validateUserBody = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30)
        .message('Поле "name" должно быть валидным')
        .messages({
          'string.required': 'Поле "name" должно быть от 2 до 30 символов',
        }),
      email: Joi.string()
        .required()
        .email()
        .message('Поле "email" должно быть валидным email-адресом')
        .messages({
          'string.required': 'Поле "email" должно быть заполнено',
        }),
    }),
  },
);

const validateMovieId = celebrate(
  {
    params: Joi.object().keys({
      movieId: Joi.string()
        .hex()
        .length(24)
        .message('Поле "movieId" должно быть валидным Id фильма')
        .messages({
          'string.required': 'Поле "email" должно быть 24-буквенным',
        }),
    }),
  },
);

module.exports = {
  validateAutentication,
  validateCreateUser,
  validateUserBody,
  validateMovieBody,
  validateMovieId,
};
