const express = require('express');

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  addMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validators');

module.exports = express.Router()
  .get('/', getMovies)
  .post('/', addMovieValidator, addMovie)
  .delete('/:movieId', deleteMovieValidator, deleteMovie);
