const { celebrate, Joi } = require('celebrate');

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

const url = Joi.string()
  .required()
  .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/);

const objectId = Joi.string()
  .required()
  .hex()
  .length(24);

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
      image: url,
      trailerLink: url,
      thumbnail: url,
      movieId: objectId,
      nameRU: mandatoryString,
      nameEN: mandatoryString,
    }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object()
    .keys({
      movieId: objectId,
    }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  updateUserValidator,
  addMovieValidator,
  deleteMovieValidator,
};
