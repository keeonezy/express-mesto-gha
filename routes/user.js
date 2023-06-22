const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users.js")

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createUser)

module.exports = router;