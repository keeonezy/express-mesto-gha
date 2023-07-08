const router = require('express').Router();
// Роутер пользователя
const userRouter = require('./user');
const cardRouter = require('./card');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/status-404');

router.use(userRouter);
router.use(cardRouter);

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
