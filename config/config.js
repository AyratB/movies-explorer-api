require('dotenv').config();

const {
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV,
  PORT,
} = process.env;

module.exports = {
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  PORT,
};
