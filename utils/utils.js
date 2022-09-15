const defaultSecretKey = 'XYxtvrdn1d9YleDtrJjkKwpsCDn3mIIX';

const validator = require('validator');

const urlValidator = (v) => validator.isURL(v);

module.exports = {
  defaultSecretKey,
  urlValidator,
};
