const Joi = require("joi");
// Registration schema
const registerSchema = Joi.object({
    name: Joi.string().required("name is required."),
    email: Joi.string().email().required("email is required."),
    password: Joi.string().min(6).required("password is required."),
    confirmpassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({ "any.only": "Passwords must match" }),
});

// Login schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Update user schema
const updateUserSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    confirmpassword: Joi.string()
        .valid(Joi.ref("password"))
        .optional()
        .messages({ "any.only": "Passwords must match" }),
});

module.exports = { registerSchema, loginSchema, updateUserSchema };
