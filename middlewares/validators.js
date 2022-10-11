const {
  celebrate,
  Joi,
} = require('celebrate');
const { urlValidator } = require('../utils/utils');

const mandatoryString = Joi.string()
  .required();

const mandatoryNumber = Joi.number()
  .required();

const email = Joi.string()
  .required()
  .email();

const userName = Joi.string()
  .required()
  .min(2)
  .max(30);

const id = Joi.string()
  .required()
  .hex()
  .length(24);

const url = (errorMessage) => Joi.string()
  .required()
  .custom((value, helpers) => {
    if (urlValidator(value)) {
      return value;
    }
    return helpers.message(errorMessage);
  });

const createUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email,
      password: mandatoryString,
      name: userName,
    }),
});

const loginValidator = celebrate({
  body: Joi.object()
    .keys({
      email,
      password: mandatoryString,
    }),
});

const updateUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email,
      name: userName,
    }),
});

const addMovieValidator = celebrate({
  body: Joi.object()
    .keys({
      country: mandatoryString,
      director: mandatoryString,
      duration: mandatoryNumber,
      year: mandatoryString,
      description: mandatoryString,
      image: url('Поле image заполнено некорректно'),
      trailerLink: url('Поле trailerLink заполнено некорректно'),
      thumbnail: url('Поле thumbnail заполнено некорректно'),
      movieId: mandatoryNumber,
      nameRU: mandatoryString,
      nameEN: mandatoryString,
    }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object()
    .keys({
      movieId: id,
    }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  updateUserValidator,
  addMovieValidator,
  deleteMovieValidator,
};
