const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NotFound } = require('../errors/notFound');
const { validateUserBody } = require('../middlewares/validateUserBody');
const { validateAuthentication } = require('../middlewares/validateAuthentication');

router.post(
  '/signin',
  validateUserBody,
  login,
);

router.post(
  '/signup',
  validateAuthentication,
  createUser,
);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').json({ message: 'Выход' });
});

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => next(new NotFound('Произошла ошибка, передан некорректный путь')));

module.exports = router;
