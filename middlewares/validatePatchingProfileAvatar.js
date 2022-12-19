const { celebrate, Joi } = require('celebrate');
const regex = require('../helpers/regex');

const validatePatchingProfileAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
});

module.exports = {
  validatePatchingProfileAvatar,
};
