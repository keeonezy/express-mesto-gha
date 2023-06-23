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
    // Если не будет ничего найдено. Название Not Found не менять
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: "Данные не найдены 404"
          });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: "Объект не найден 400",
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

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: "Данные не найдены"
          });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
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

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: "Данные не найдены"
          });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
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
  updateUser,
  updateUserAvatar,
};