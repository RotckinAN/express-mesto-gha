const { celebrate, Joi } = require('celebrate');

const validatePutLikeData = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validatePutLikeData,
};
