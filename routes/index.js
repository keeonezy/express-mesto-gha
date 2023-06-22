const router = require("express").Router();
// Роутер пользователя
const userRouter = require("./user");

router.use(userRouter);

module.exports = router;