const router = require("express").Router();
// Роутер пользователя
const userRouter = require("./user");
const cardRouter = require("./card");

router.use(userRouter);
router.use(cardRouter);

module.exports = router;