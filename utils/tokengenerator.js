const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to generate tokens
exports.generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Access token expires in 1 hour
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "10d", // Refresh token expires in 7 days
  });
  return { accessToken, refreshToken };
};
exports.jsonAuthMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader)
    return res.status(401).json({ msg: "Unauthorized" });

  const token = authorizationHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};
