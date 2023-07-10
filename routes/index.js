const router = require('express').Router();
// Роутер пользователя
const userRouter = require('./user');
const cardRouter = require('./card');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/status-404');
const { signupValidator, signinValidator } = require('../middlewares/validation');

router.post('/signin', signinValidator, login);
router.post('/signup', signupValidator, createUser);
router.use(auth);

router.use(userRouter);
router.use(cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
