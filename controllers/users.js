// Для теста в postman - http://localhost:3000/users.then((user) => res.status(STATUS_CREATED).sen
// http://localhost:3000/users?name=Вася&about=Пися&avatar=https

const User = require("../models/user");
const {
  STATUS_OK,
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR } = require("../utils/responseStatus");

const getUsers = async (req, res) => {
  try {
    // Ожидание ответа
    const users = await User.find({});
    res.status(STATUS_OK).send(users);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR)
        .send({
          message: "Данные не корректны"
        })
    } else {
      res.status(INTERNAL_SERVER_ERROR)
        .send({
          message: "Ошибка сервера",
          err: err.message,
          stack: err.stack,
        })
    }
  }
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // 201 статус должен быть успешным
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: "Данные переданы не правильно"
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR)
          .send({
            message: "Ошибка сервера",
            err: err.message,
            stack: err.stack,
          })
      }
    })
}

module.exports = {
  getUsers,
  createUser,
};