const User = require("./../models/userModel");
const { createUserSchema } = require("../validation/userValidation");

const registerController = async (req, res) => {
    const { error, value } = createUserSchema.validate(req.body, {
        abortEarly: false, // Set abortEarly to false to collect all errors
    });
    if (error) {
        const errors = error.details?.map((detail) => detail.message);
        console.log(errors, "errors");
        return res.status(400).json({ errors });
    }
    try {
        const { name, email, password, role } = value;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }
        const user = new User({
            name,
            email,
            password,
            role,
        });
        await user.save();
        res.status(201).send({
            success: true,
            message: "Register Succcessfully please Login",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Register api",
            error,
        });
    }
};
module.exports = registerController;
