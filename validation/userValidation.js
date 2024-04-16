const Joi = require('joi');

// Define the validation schema for creating a new user
const createUserSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Password and confirm password must match'
    }),
    role: Joi.string().valid('user', 'admin').default('user'),
})

// Define the validation schema for updating a user
const updateUserSchema = Joi.object({
    name: Joi.string().optional().trim(),
    email: Joi.string().email().optional().trim(),
    password: Joi.string().min(6).max(20).optional(),
    role: Joi.string().valid('user', 'admin').optional(),
});

// Export the schemas
module.exports = {
    createUserSchema,
    updateUserSchema,
};
