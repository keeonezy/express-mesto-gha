const router = require('express').Router();
// Роутер пользователя
const userRouter = require('./user');
const cardRouter = require('./card');
const { NOT_FOUND_ERROR } = require('../utils/responseStatus');
const { login, createUser } = require("../controllers/users");
const auth = require('../middlewares/auth');

router.use(userRouter);
router.use(cardRouter);

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);

router.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});

module.exports = router;
