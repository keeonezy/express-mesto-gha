const router = require('express').Router();
const { userUpdateValidator, usersAvatarValidator } = require('../utils/validation');
const {
  getUsers, getUserInfo, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', getUserById);
router.patch('/users/me', userUpdateValidator, updateUser);
router.patch('/users/me/avatar', usersAvatarValidator, updateUserAvatar);

module.exports = router;
