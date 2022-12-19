const router = require('express').Router();

const {
  getUsers, patchProfileInfo, patchProfileAvatar, getCurrentUser, getUser,
} = require('../controllers/users');
const { validateGettingUser } = require('../middlewares/validateGettingUser');
const { validatePatchingProfileUser } = require('../middlewares/validatePatchingProfileUser');
const { validatePatchingProfileAvatar } = require('../middlewares/validatePatchingProfileAvatar');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  validateGettingUser,
  getUser,
);

router.patch(
  '/me',
  validatePatchingProfileUser,
  patchProfileInfo,
);

router.patch(
  '/me/avatar',
  validatePatchingProfileAvatar,
  patchProfileAvatar,
);

module.exports = router;
