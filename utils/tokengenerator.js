const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to generate tokens
exports.generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Access token expires in 1 hour
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
        expiresIn: "7d", // Refresh token expires in 7 days
    });

    return { accessToken, refreshToken };
};
