const Joi = require("joi");

// Define Joi schema for the Post model
const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  // postedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = postSchema;
