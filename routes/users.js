const router = require('express').Router();
const {
  getUser, getUsers, createUser, patchProfileInfo, patchProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', patchProfileInfo);
router.patch('/me/avatar', patchProfileAvatar);

module.exports = router;
