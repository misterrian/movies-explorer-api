const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

require('dotenv').config();

const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/moviesdb',
  NODE_ENV = 'dev',
} = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { errorsHandler } = require('./middlewares/errors');

const app = express();

const whitelist = [
  'http://api.misterrian.movies.nomoredomains.sbs',
  'https://api.misterrian.movies.nomoredomains.sbs',
];

app.use(cors({
  origin(origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(requestLogger);
app.use(helmet());
app.use(rateLimit(require('./utils/rete-limit.json')));

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} in ${NODE_ENV} mode`);
});
