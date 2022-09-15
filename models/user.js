const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/unauthorized-error');
const { urlValidator } = require('../utils/utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: urlValidator,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, {
  versionKey: false,
  validateBeforeSave: true,
});

function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              return user;
            }
            return Promise.reject(new UnauthorizedError('Некорректный пользователь или пароль'));
          });
      }
      return Promise.reject(new UnauthorizedError('Некорректный пользователь или пароль'));
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
