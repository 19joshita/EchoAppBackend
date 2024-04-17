const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const { generateTokens } = require("../utils/tokengenerator");
require("dotenv").config();
// Registration
exports.register = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password } = value;
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res
            .status(400)
            .json({ error: "Email already exists", status: false });
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
        .json({ message: "User registered successfully", status: true });
};

// Login
exports.login = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ message: error.details[0].message, status: false });
    }

    const { email, password } = value;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid email", status: false });
    }

    // Check the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ error: "Invalid password", status: false });
    }
    const message = "User Login Successfully";
    const status = true;
    // Create a JWT token only
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    // });   res.json({ token });
    // ****Create refresh token and access token ****//
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.json({ accessToken, refreshToken, user, message, status });
};
