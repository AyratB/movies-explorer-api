const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsHandler } = require('./middlewares/corsHandler');
const router = require('./routes/index');
const commonErrorHandler = require('./middlewares/commonErrorHandler');
const { MONGO_URL, PORT = 3000 } = require('./config/config');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(corsHandler);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(commonErrorHandler);

app.listen(PORT);
