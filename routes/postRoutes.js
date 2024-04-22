const express = require("express");
const postController = require("../controllers/PostController");
const { jsonAuthMiddleware } = require("../utils/tokengenerator");

const router = express.Router();
router.post(
  "/createPost",
  jsonAuthMiddleware,
  postController.createPostController
);
router.get("/allPost", jsonAuthMiddleware, postController.getAllPosts);

module.exports = router;
