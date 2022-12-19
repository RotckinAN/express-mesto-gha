const Card = require('../models/card');
const { BadRequest } = require('../errors/badRequest');
const { Forbidden } = require('../errors/forbidden');
const { NotFound } = require('../errors/notFound');
const { InternalServerError } = require('../errors/internalServerError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка загрузки карточек'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    const card = await Card.create({ name, link, owner: ownerId });

    return res.status(201).json(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById({ _id: cardId });

    if (card === null) {
      throw new NotFound('Запрашиваемая карточка не найдена');
    }
    if (card.owner.valueOf() === userId) {
      await card.remove();
    } else {
      throw new Forbidden('Произошла ошибка, вы не имеете права удалять карточку');
    }

    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

const putLike = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (card === null) {
      throw new NotFound('Произошла ошибка, переданы некорректные данные карточки (карточка не найдена)');
    }

    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (card === null) {
      throw new NotFound('Произошла ошибка, переданы некорректные данные карточки (карточка не найдена)');
    }

    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
