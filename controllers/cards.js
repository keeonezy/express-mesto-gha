const Card = require('../models/card');
const { STATUS_CREATED } = require('../utils/responseStatus');
const BadRequestError = require("../utils/status-400");
const NotFoundError = require("../utils/status-404");

module.exports.getCards = async (req, res, next) => {
  try {
    // Ожидание ответа
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner })
    // 201 статус должен быть успешным
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError("Не правильно переданы данные"))
      } else {
        next(err)
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => { throw new NotFoundError("Карточка для удаления не найдена") })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError("Не правильно переданы данные"))
      } else {
        next(err)
      }
    });
};

module.exports.setLikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка для лайка не найдена') })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError("Не правильно переданы данные"))
      } else {
        next(err)
      }
    });
};

module.exports.deleteLikeCard = (req, res) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { throw new NotFoundError("Карточка для удаления лайка не найдена") })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError("Не правильно переданы данные"))
      } else {
        next(err)
      }
    });
};
