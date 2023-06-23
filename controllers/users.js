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
    if (err.name === "ValidationError") {
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

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    // Если не будет ничего найдено
    .orFail(() => new Error("Не найдено"))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: "Данные не найдены"
          });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: "Объект не найден",
          })
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
  getUserById,
  createUser,
};