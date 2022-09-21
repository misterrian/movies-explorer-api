const express = require('express');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

const { updateUserValidator } = require('../middlewares/validators');

module.exports = express.Router()
  .get('/me', getCurrentUser)
  .patch('/me', updateUserValidator, updateProfile);
