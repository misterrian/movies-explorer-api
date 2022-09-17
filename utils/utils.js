const validator = require('validator');

const urlValidator = (v) => validator.isURL(v);

module.exports = {
  urlValidator,
};
