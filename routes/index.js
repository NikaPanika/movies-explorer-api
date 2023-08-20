const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../erorrs/notFound');
const { validateLogin, validateCreation } = require('../middlewares/validation');

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreation, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', () => {
  throw new NotFoundError('Неверный путь');
});
module.exports = router;
