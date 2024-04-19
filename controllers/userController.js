const bcrypt = require("bcrypt");
const User = require("./../models/userModel");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const { generateTokens } = require("../utils/tokengenerator");
require("dotenv").config();
// Registration
exports.register = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        const { name, email, password } = value;
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(500)
                .send({ message: "Email already exists", status: false });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        // Save the user to the database
        await user.save();
        res
            .status(201)
            .send({ message: "User registered successfully", status: true });
    } catch (err) {
        return res.status(500).send({
            message: "error in login api",
            status: false,
            error,
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .send({ message: error.details[0].message, status: false });
        }
        const { email, password } = value;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(500)
                .send({ message: "User Not Found!", status: false });
        }
        // Check the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(500)
                .send({ message: "Invalid Password", status: false });
        }
        user.password = undefined;
        // ****Create refresh token and access token ****//
        const { accessToken, refreshToken } = generateTokens(user._id);
        res.status(200).send({
            message: "Login Successfully",
            status: true,
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        return res.status(500).send({
            message: "error in login api",
            status: false,
            error,
        });
    }
};
