const router = require('express').Router();
const { userUpdateValidator, userAvatarValidator, userIdValidator } = require('../middlewares/validation');
const {
  getUsers, getUserInfo, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:id', userIdValidator, getUserById);
router.patch('/users/me', userUpdateValidator, updateUser);
router.patch('/users/me/avatar', userAvatarValidator, updateUserAvatar);

module.exports = router;
