const mongoose = require('mongoose');
const { urlValidator } = require('../utils/utils');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: urlValidator,
      message: 'Ссылка на постер указана с ошибками',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: urlValidator,
      message: 'Ссылка на трейлер указана с ошибками',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: urlValidator,
      message: 'Ссылка на миниатюрное изображение постера указана с ошибками',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  validateBeforeSave: true,
});

module.exports = mongoose.model('movie', movieSchema);
