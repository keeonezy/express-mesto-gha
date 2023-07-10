const mongoose = require('mongoose');
const Card = require('../models/card');
const { STATUS_CREATED } = require('../errors/responseStatus');
const BadRequestError = require('../errors/status-400');
const ForbiddenError = require('../errors/status-403');
const NotFoundError = require('../errors/status-404');

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const body = { ...req.body, owner: req.user._id };

  Card.create(body)
    // 201 статус должен быть успешным
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Не правильно переданы данные'));
      } else next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Карточка для удаления не найдена'); })
    .then((card) => card.owner.equals(req.user._id))
    .then((match) => {
      if (!match) {
        throw new ForbiddenError('Нет прав для удаления данной карточки');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Не правильно переданы данные'));
      } else next(err);
    });
};

module.exports.setLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка для лайка не найдена'); })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Не правильно переданы данные'));
      } else next(err);
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка для удаления лайка не найдена'); })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Не правильно переданы данные'));
      } else next(err);
    });
};
