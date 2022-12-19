const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../helpers/token');
const { BadRequest } = require('../errors/badRequest');
const { Unauthorized } = require('../errors/unauthorized');
const { NotFound } = require('../errors/notFound');
const { Conflict } = require('../errors/conflict');
const { InternalServerError } = require('../errors/internalServerError');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Unauthorized('Неправильные почта или пароль');
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      return res.status(200).cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
      }).json({ message: 'Вход выполнен успешно' });
    }
    throw new Unauthorized('Неправильные почта или пароль');
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).orFail(() => new Error('Пользователи не найдены'));
    return res.status(200).json(users);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка загрузки данных о пользователях'));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (user === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Произошла ошибка загрузки данных о пользователе'));
    }
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Произошла ошибка загрузки данных о пользователе'));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    if (err.message.indexOf('duplicate key error') !== -1) {
      next(new Conflict('Произошла ошибка, пользователь с таким email уже существует, введите новый email'));
    }
    return next(err);
  }
};

const patchProfileInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const newUserInfo = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    });

    if (newUserInfo === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.status(200).json({
      name: newUserInfo.name,
      about: newUserInfo.about,
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

const patchProfileAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const newUserAvatar = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    });

    if (newUserAvatar === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.status(200).json({
      avatar: newUserAvatar.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  login,
  createUser,
  getCurrentUser,
  patchProfileInfo,
  patchProfileAvatar,
};
