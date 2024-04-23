const postSchema = require("../validation/postValidation");
const postModel = require("./../models/postModel");
exports.createPostController = async (req, res) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description } = value;
    const post = new postModel({
      title,
      description,
      postedBy: req.user.userId,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id, name")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Posts fetched successfully", status: true, posts });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getUserPosts = async (req, res) => {
  try {
    const UserPost = await postModel
      .find({ postedBy: req?.user?.userId })
      .populate("postedBy", "_id, name")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Posts fetched successfully", status: true, UserPost });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await postModel.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post deleted successfully", status: true });
  } catch (error) {
    console.error("Error deleting post by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate("postedBy", "username");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post found successfully", status: true, post });
  } catch (error) {
    console.error("Error getting post by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to update a post by ID
exports.updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
