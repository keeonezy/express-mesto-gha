const router = require("express").Router();
const { getUsers, getUserById, createUser, updateUser, updateUserAvatar } = require("../controllers/users.js")

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createUser);
router.patch("/users/me", updateUser);
// router.patch("/users/me/avatar", updateUserAvatar)

module.exports = router;