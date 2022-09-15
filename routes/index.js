const express = require('express');

const {
  createUserValidator,
  loginValidator,
} = require('../middlewares/validators');

const {
  login,
  createUser,
  signout,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-error');

const router = express.Router();

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

router.use(auth);

router.get('/signout', signout);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Некорректный путь'));
});

module.exports = router;
