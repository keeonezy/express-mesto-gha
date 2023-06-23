const router = require("express").Router();
const { getCards, createCard, deleteCardById, setLikeCard, deleteLikeCard } = require("../controllers/cards.js")

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCardById);
router.put("/cards/:cardId/likes", setLikeCard);
// router.delete("/cards/:cardId/likes", deleteLikeCard);

module.exports = router;