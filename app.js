const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors} = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
// const { errorHandler } = require('./helpers/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(404).json({ message: 'Произошла ошибка, передан некорректный путь' }));

// app.use(errorHandler);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
