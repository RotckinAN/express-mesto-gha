const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../helpers/token');
const {
  Unauthorized, InternalServerError, NotFound, BadRequest, Conflict,
} = require('../helpers/errors');

const login = async (req, res, next) => {
  try {
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
      if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка при выполнении запроса');
      }
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    try {
      const users = await User.find({}).orFail(() => new Error('Пользователи не найдены'));
      return res.status(200).json(users);
    } catch (err) {
      throw new InternalServerError('Произошла ошибка загрузки данных о пользователях');
    }
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (user === null) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }

      return res.status(200).json(user);
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequest('Произошла ошибка загрузки данных о пользователе');
      }
      if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка при выполнении запроса');
      }
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (user === null) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }

      return res.status(200).json(user);
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequest('Произошла ошибка загрузки данных о пользователе');
      }
      if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка при выполнении запроса');
      }
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    try {
      const {
        email, password, name, about, avatar,
      } = req.body;

      if (validator.isEmail(email)) {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
          email, password: hash, name, about, avatar,
        });

        return res.status(201).json({
          _id: user._id,
          email: user.email,
          password,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
      throw new BadRequest('Произошла ошибка, необходимо ввести корректный email');
    } catch (err) {
      if (err.message.indexOf('user validation failed: avatar') !== -1) {
        throw new BadRequest('Произошла ошибка, передана некорректная ссылка аватара');
      }
      if (err.name === 'ValidationError' || err.name === 'TypeError' || err.message.indexOf('Illegal arguments') !== -1) {
        throw new BadRequest('Произошла ошибка, переданы некорректные данные');
      }
      if (err.message.indexOf('duplicate key error') !== -1) {
        throw new Conflict('Произошла ошибка, пользователь с таким email уже существует, введите новый email');
      }
      if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка при выполнении запроса');
      }
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

const patchProfileInfo = async (req, res, next) => {
  try {
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
      if (!name || !about) {
        throw new BadRequest('Произошла ошибка, переданы некорректные данные, отсутсвуют обязательные поля');
      }

      return res.status(200).json({
        name: newUserInfo.name,
        about: newUserInfo.about,
      });
    } catch (err) {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Произошла ошибка, переданы некорректные данные');
      }
      if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка при выполнении запроса');
      }
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

const patchProfileAvatar = async (req, res, next) => {
  try {
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
      if (!avatar) {
        throw new BadRequest('Произошла ошибка, переданы некорректные данные, отсутсвуют обязательные поля');
      }

      return res.status(200).json({
        avatar: newUserAvatar.avatar,
      });
    } catch (err) {
      if (err.message.indexOf('Validation failed: avatar') !== -1) {
        throw new BadRequest('Произошла ошибка, передана некорректная ссылка аватара');
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Произошла ошибка, переданы некорректные данные');
      }
      if (err.statusCode === 500) {
        throw new InternalServerError('Произошла ошибка при обновлении аватара');
      }
      return next(err);
    }
  } catch (err) {
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
