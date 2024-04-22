const express = require("express");
const authController = require("../controllers/userController");
const { jsonAuthMiddleware } = require("../utils/tokengenerator");

const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/updateUser", jsonAuthMiddleware, authController.updateUser);
module.exports = router;
