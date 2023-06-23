const Card = require("../models/card");
const {
  STATUS_OK,
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR } = require("../utils/responseStatus");

module.exports.getCards = async (req, res) => {
  try {
    // Ожидание ответа
    const cards = await Card.find({});
    res.status(STATUS_OK).send(cards);
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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner })
    // 201 статус должен быть успешным
    .then((card) => res.status(STATUS_CREATED).send(card))
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
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    // Если не будет ничего найдено. Название Not Found не менять т.к коды будут не корректно работать т.к коды будут не корректно работать
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
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

module.exports.setLikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // Если не будет ничего найдено. Название Not Found не менять т.к коды будут не корректно работать
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
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

module.exports.deleteLikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } }, // убрать _id из массива
    { new: true },
  )
    // Если не будет ничего найдено. Название Not Found не менять т.к коды будут не корректно работать
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(STATUS_OK).send(card))
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