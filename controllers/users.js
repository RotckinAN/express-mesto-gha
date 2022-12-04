const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'Произошла ошибка загрузки данных о пользователях' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    return res.status(400).json({ message: 'Произошла ошибка загрузки данных о пользователе' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).json(user);
  } catch (err) {
    console.error(err);

    return res.status(400).json({ message: 'Произошла ошибка, переданы некорректные данные' });
  }
};

const patchProfileInfo = async (req, res) => {
  try {
    let profileInfo = {};
    if (req.body.name && req.body.about) {
      profileInfo = req.body;
    } else {
      return res.status(400).send({ message: 'Произошла ошибка, переданы некорректные данные' });
    }

    const userId = req.user._id;
    const newUserInfo = await User.findByIdAndUpdate(userId, profileInfo, {
      new: true,
      runValidators: true,
    });

    if (newUserInfo === null) {
      return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.status(200).json({
      name: newUserInfo.name,
      about: newUserInfo.about,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'Произошла ошибка при обновлении профиля' });
  }
};

const patchProfileAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    let avatar = {};

    if (req.body.avatar) {
      avatar = req.body;
    } else {
      return res.status(400).send({ message: 'Произошла ошибка, переданы некорректные данные' });
    }

    const newUserAvatar = await User.findByIdAndUpdate(userId, avatar, {
      new: true,
      runValidators: true,
    });

    if (newUserAvatar === null) {
      return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.status(200).json({
      avatar: newUserAvatar.avatar,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'Произошла ошибка при обновлении аватара' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchProfileInfo,
  patchProfileAvatar,
};
