const router = require('express').Router();

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');
const { validateCreateCardData } = require('../middlewares/validateCreateCardData');
const { validateDeleteCardData } = require('../middlewares/validateDeleteCardData');
const { validatePutLikeData } = require('../middlewares/validatePutLikeData');
const { validateDeleteLikeData } = require('../middlewares/validateDeleteLikeData');

router.get('/', getCards);

router.post(
  '/',
  validateCreateCardData,
  createCard,
);

router.delete(
  '/:cardId',
  validateDeleteCardData,
  deleteCard,
);

router.put(
  '/:cardId/likes',
  validatePutLikeData,
  putLike,
);

router.delete(
  '/:cardId/likes',
  validateDeleteLikeData,
  deleteLike,
);

module.exports = router;
