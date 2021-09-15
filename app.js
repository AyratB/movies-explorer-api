const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

// покдлючение к серверу и базе
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT);

// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const cookieParser = require('cookie-parser');
// const { errors } = require('celebrate');
// const { celebrate, Joi } = require('celebrate');
// const validator = require('validator');
// const NotFoundError = require('./errors/not_found_err');

// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { corsHandler } = require('./middlewares/corsHandler');

// const isUrl = (value) => {
//   if (validator.isURL(value)) {
//     return value;
//   }
//   throw new Error('URL validation err');
// };

// const {
//   login, createUser,
// } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const commonErrorHandler = require('./middlewares/commonErrorHandler');

// // const { PORT = 3000 } = process.env;

// //const app = express();

// // mongoose.connect('mongodb://localhost:27017/mestodb', {
// //   useNewUrlParser: true,
// //   useCreateIndex: true,
// //   useFindAndModify: false,
// //   useUnifiedTopology: true,
// // });

// app.use(cookieParser());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(helmet());

// app.use(requestLogger);
// app.use(corsHandler);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(2),
//   }),
// }), login);

// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().custom(isUrl),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(2),
//   }),
// }), createUser);

// app.use(auth);

// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));

// app.use('*', (req, res, next) => {
//   next(new NotFoundError('Запрашиваемый ресурс не найден'));
// });

// app.use(errorLogger);

// app.use(errors());

// app.use(commonErrorHandler);

// // app.listen(PORT);
