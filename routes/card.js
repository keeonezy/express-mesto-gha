const router = require('express').Router();
const { cardCreateValidator, cardIdValidator } = require('../utils/validation');
const {
  getCards, createCard, deleteCardById, setLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', cardCreateValidator, createCard);
router.delete('/cards/:cardId', cardIdValidator, deleteCardById);
router.put('/cards/:cardId/likes', cardIdValidator, setLikeCard);
router.delete('/cards/:cardId/likes', cardIdValidator, deleteLikeCard);

module.exports = router;
