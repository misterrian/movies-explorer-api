const jwt = require('jsonwebtoken');

const defaultSecretKey = require('../utils/constants');

const { JWT_SECRET = defaultSecretKey } = process.env;

const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      next(new UnauthorizedError('Некорректный пользователь или пароль'));
    }
  } else {
    next(new UnauthorizedError('Необходима авторизация пользователя'));
  }
};

module.exports = {
  auth,
};
