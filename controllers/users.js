// Для теста в postman - http://localhost:3000/users.then((user) => res.status(STATUS_CREATED).sen
// http://localhost:3000/users?name=Вася&about=Пися&avatar=https

const User = require("../models/user");

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // 201 статус должен быть успешным
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400)
          .send({
            message: "Данные переданы не правильно"
          });
      } else {
        res.status(500)
          .send({
            message: "Ошибка сервера",
            err: err.message,
            stack: err.stack,
          });
      }
    })
}

module.exports = {
  postUser,
};