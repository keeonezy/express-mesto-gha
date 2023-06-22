const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users.js")

router.get("/users", getUsers);
// router.get("/users:id", getUserById);
router.post("/users", createUser)

module.exports = router;