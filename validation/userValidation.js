const Joi = require("joi");
// Registration schema
const registerSchema = Joi.object({
    name: Joi.string().required("name is required."),
    email: Joi.string().email().required("email is required."),
    password: Joi.string().min(6).required("password is required."),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({ "any.only": "Passwords must match" }),
});

// Login schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
