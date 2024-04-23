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
router.get("/user-post", jsonAuthMiddleware, postController.getUserPosts);
router.delete(
  "/delete-post/:id",
  jsonAuthMiddleware,
  postController.deletePostById
);
router.get("/post/:id", jsonAuthMiddleware, postController.getPostById);
router.put("/post/:id", jsonAuthMiddleware, postController.updatePostById);

module.exports = router;
