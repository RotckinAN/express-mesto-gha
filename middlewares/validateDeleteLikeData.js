const { celebrate, Joi } = require('celebrate');

const validateDeleteLikeData = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateDeleteLikeData,
};
