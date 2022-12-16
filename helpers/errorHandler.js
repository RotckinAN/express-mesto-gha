const { isCelebrateError } = require('celebrate');

const errorHandler = ((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const validation = {};

    for (const [segment, joiError] of err.details.entries()) {
      validation[segment] = {
        message: joiError.message,
      };
    }

    const errorMessage = Object.values(validation).map((item) => item.message);
    const errorRequest = `Произошла ошибка, переданы некорректные данные: ${errorMessage.join(', ')}`;
    return res.status(400).json({ message: errorRequest });
  }
  return next(err);
});

module.exports = {
  errorHandler,
};
