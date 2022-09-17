const {
  DocumentNotFoundError,
  ValidationError,
  CastError,
} = require('mongoose').Error;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');

const defaultSecretKey = require('../utils/constants');

const { JWT_SECRET = defaultSecretKey } = process.env;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send(user.toObject({ useProjection: true })))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3800000 * 7 * 24,
          httpOnly: true,
        })
        .send({ message: 'OK' });
    })
    .catch(next);
};

const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'OK' });
};

const getCurrentUser = (req, res, next) => {
  if (req.user) {
    User.findById(req.user._id)
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof CastError) {
          next(new BadRequestError('Некорректный id пользователя'));
        } else if (err instanceof DocumentNotFoundError) {
          next(new NotFoundError('Запрашиваемый пользователь не найден'));
        } else {
          next(new InternalServerError('Произошла ошибка'));
        }
      });
  } else {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

module.exports = {
  login,
  createUser,
  signout,
  getCurrentUser,
  updateProfile,
};
