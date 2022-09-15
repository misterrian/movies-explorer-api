const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const InternalServerError = require('../errors/internal-server-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError('Произошла ошибка')));
};

const addMovie = (req, res, next) => {
  const { name, link } = req.body;

  Movie.create({ owner: req.user._id, name, link })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка'));
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Movie.findOneAndRemove({ _id: req.params.cardId })
          .populate('owner')
          .orFail()
          .then((cardWithOwner) => res.send(cardWithOwner));
      }
      return Promise.reject(new ForbiddenError('Нельзя изменять данные других пользователей'));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некоректный id карточки'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
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
