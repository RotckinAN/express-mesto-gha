const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'Произошла ошибка загрузки карточек' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });

    return res.status(201).json(card);
  } catch (err) {
    console.error(err);

    return res.status(400).json({ message: 'Произошла ошибка, переданы некорректные данные' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);

    if (card === null) {
      return res.status(404).json({ message: 'Запрашиваемая карточка не найдена' });
    }

    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    console.error(err);

    if (typeof req.params.cardId === 'string') {
      return res.status(400).send({ message: 'Произошла ошибка, переданы некорректные данные' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при удалении карточки' });
  }
};

const putLike = async (req, res) => {
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
      return res.status(404).json({ message: 'Произошла ошибка, переданы некорректные данные карточки (карточка не найдена)' });
    }

    return res.status(200).json(card);
  } catch (err) {
    console.error(err);

    if (typeof req.params.cardId === 'string') {
      return res.status(400).send({ message: 'Произошла ошибка, переданы некорректные данные' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при добавлении лайка' });
  }
};

const deleteLike = async (req, res) => {
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
      return res.status(404).json({ message: 'Произошла ошибка, переданы некорректные данные карточки (карточка не найдена)' });
    }

    return res.status(200).json(card);
  } catch (err) {
    console.error(err);

    if (typeof req.params.cardId === 'string') {
      return res.status(400).send({ message: 'Произошла ошибка, переданы некорректные данные' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при удалении лайка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
