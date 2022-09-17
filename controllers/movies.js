const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const InternalServerError = require('../errors/internal-server-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(() => next(new InternalServerError('Произошла ошибка')));
};

const addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findOneAndRemove({ _id: req.params.movieId })
          .populate('owner')
          .orFail()
          .then((movieWithOwner) => res.send(movieWithOwner));
      }
      return Promise.reject(new ForbiddenError('Нельзя изменять данные других пользователей'));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id фильма'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый фильм не найден'));
      } else if (err instanceof ForbiddenError) {
        next(err);
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
