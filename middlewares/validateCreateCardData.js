const { celebrate, Joi } = require('celebrate');
const regex = require('../helpers/regex');

const validateCreateCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

module.exports = {
  validateCreateCardData,
};
